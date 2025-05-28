import axios, {
  AxiosInstance,
  AxiosRequestConfig,
  CancelTokenSource,
  AxiosResponse,
  AxiosError,
  mergeConfig
} from 'axios';
import { useCallback, useEffect, useRef, useState } from 'react';

// 类型定义
interface AxiosConfig extends AxiosRequestConfig {
  instance?: AxiosInstance;
}

interface HookOptions {
  concurrency?: number;
  debounce?: number;
  immediate?: boolean;
  defaultRetry?: number;
  defaultRetryDelay?: number;
  cacheEnabled?: boolean;
  ssr?: boolean;
  interceptors?: {
    request?: ((config: AxiosRequestConfig) => AxiosRequestConfig | Promise<AxiosRequestConfig>)[];
    response?: ((response: AxiosResponse) => AxiosResponse | Promise<AxiosResponse>)[];
    error?: (error: AxiosError) => Promise<never>;
  };
}

interface RequestConfig extends AxiosRequestConfig {
  retry?: number;
  retryDelay?: number;
  cacheKey?: string;
  cacheTTL?: number;
  cancelKey?: string;
  useCache?: boolean;
  dependent?: Promise<any>;
  progress?: (progress: number) => void;
}

interface QueueItem {
  config: RequestConfig;
  resolve: (value: unknown) => void;
  reject: (reason?: any) => void;
  cancel?: CancelTokenSource;
}

type CacheStore = Record<
  string,
  {
    timestamp: number;
    data: any;
    ttl?: number;
  }
>;

export function useAxios<T = any>(axiosConfig: AxiosConfig = {}, hookOptions: HookOptions = {}) {
  // 解构配置
  const { instance: userInstance, ...pureAxiosConfig } = axiosConfig;
  const {
    concurrency = 5,
    debounce = 0,
    immediate = true,
    defaultRetry = 0,
    defaultRetryDelay = 1000,
    cacheEnabled = false,
    ssr = false,
    interceptors
  } = hookOptions;

  // 创建Axios实例
  const instance = useRef<AxiosInstance>(userInstance || axios.create(pureAxiosConfig)).current;

  // 状态管理
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<AxiosError<T> | null>(null);
  const [data, setData] = useState<T | null>(null);
  const [progress, setProgress] = useState(0);

  // 引用管理
  const activeRequests = useRef(new Set<CancelTokenSource>());
  const queue = useRef<QueueItem[]>([]);
  const processing = useRef<Set<Promise<any>>>(new Set());
  const debounceTimer = useRef<number>();
  const retryCounts = useRef<Map<Promise<any>, number>>(new Map());
  const cache = useRef<CacheStore>({});

  // 拦截器管理
  useEffect(() => {
    const requestInterceptors: number[] = [];
    const responseInterceptors: number[] = [];

    if (interceptors?.request) {
      interceptors.request.forEach((interceptor) => {
        const id = instance.interceptors.request.use(interceptor);
        requestInterceptors.push(id);
      });
    }

    if (interceptors?.response) {
      interceptors.response.forEach((interceptor) => {
        const id = instance.interceptors.response.use(
          (response) => interceptor(response),
          (error) => interceptors.error?.(error) || Promise.reject(error)
        );
        responseInterceptors.push(id);
      });
    }

    return () => {
      requestInterceptors.forEach((id) => instance.interceptors.request.eject(id));
      responseInterceptors.forEach((id) => instance.interceptors.response.eject(id));
    };
  }, [instance, interceptors]);

  // 缓存管理
  const getCache = useCallback((key: string) => {
    const item = cache.current[key];
    if (!item) return null;
    if (item.ttl && Date.now() - item.timestamp > item.ttl) {
      delete cache.current[key];
      return null;
    }
    return item.data;
  }, []);

  const setCache = useCallback((key: string, data: any, ttl?: number) => {
    cache.current[key] = { timestamp: Date.now(), data, ttl };
  }, []);

  // 队列处理器
  const processQueue = useCallback(async () => {
    while (queue.current.length > 0 && processing.current.size < concurrency) {
      const item = queue.current.shift()!;
      const { config: userConfig } = item;

      // 合并配置
      const mergedConfig = mergeConfig(instance.defaults, pureAxiosConfig, userConfig) as RequestConfig;

      // 依赖请求处理
      if (mergedConfig.dependent) {
        try {
          await mergedConfig.dependent;
        } catch {
          item.reject(new Error('Dependency failed'));
          continue;
        }
      }

      // 缓存检查
      if (mergedConfig.useCache && mergedConfig.cacheKey) {
        const cached = getCache(mergedConfig.cacheKey);
        if (cached) {
          item.resolve(cached);
          continue;
        }
      }

      const source = axios.CancelToken.source();
      activeRequests.current.add(source);

      // 进度处理
      const progressHandler = (type: 'upload' | 'download') => (progressEvent: ProgressEvent) => {
        if (!progressEvent.total) return;
        const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total);
        mergedConfig.progress?.(percent) || setProgress(percent);
      };

      const promise = instance({
        ...mergedConfig,
        cancelToken: source.token,
        onUploadProgress: progressHandler('upload'),
        onDownloadProgress: progressHandler('download')
      })
        .then((response) => {
          if (mergedConfig.useCache && mergedConfig.cacheKey) {
            setCache(mergedConfig.cacheKey, response.data, mergedConfig.cacheTTL);
          }
          setData(response.data);
          return response.data;
        })
        .catch(async (error: AxiosError<T>) => {
          setError(error);
          const handledError = await (interceptors?.error?.(error) || Promise.reject(error));

          const retry = mergedConfig.retry ?? defaultRetry;
          const retryDelay = mergedConfig.retryDelay ?? defaultRetryDelay;
          const count = retryCounts.current.get(promise) ?? 0;

          if (count < retry && !axios.isCancel(handledError)) {
            retryCounts.current.set(promise, count + 1);
            await new Promise((resolve) => setTimeout(resolve, retryDelay));
            queue.current.unshift(item);
            processQueue();
            return;
          }

          throw handledError;
        })
        .finally(() => {
          processing.current.delete(promise);
          activeRequests.current.delete(source);
          retryCounts.current.delete(promise);
          if (processing.current.size === 0 && queue.current.length === 0) {
            setLoading(false);
            setProgress(0);
          }
        });

      processing.current.add(promise);
      setLoading(true);
      promise.then(item.resolve).catch(item.reject);
    }
  }, [concurrency, instance, pureAxiosConfig, defaultRetry, defaultRetryDelay, getCache, setCache, interceptors]);

  // 请求方法
  const request = useCallback(
    (config: RequestConfig = {}) => {
      return new Promise<T>((resolve, reject) => {
        const execute = () => {
          if (ssr && typeof window === 'undefined') {
            reject(new Error('SSR mode cannot use browser features'));
            return;
          }

          const mergedConfig = mergeConfig(instance.defaults, pureAxiosConfig, config) as RequestConfig;

          queue.current.push({
            config: mergedConfig,
            resolve,
            reject,
            cancel: axios.CancelToken.source()
          });
          processQueue();
        };

        if (debounce > 0) {
          if (immediate && !debounceTimer.current) {
            execute();
          }
          window.clearTimeout(debounceTimer.current);
          debounceTimer.current = window.setTimeout(() => {
            if (!immediate) execute();
            debounceTimer.current = undefined;
          }, debounce);
        } else {
          execute();
        }
      });
    },
    [debounce, immediate, processQueue, instance, pureAxiosConfig, ssr]
  );

  // 辅助方法
  const cancel = useCallback((cancelKey?: string) => {
    if (cancelKey) {
      const request = queue.current.find((i) => i.config.cancelKey === cancelKey);
      request?.cancel?.cancel();
    } else {
      activeRequests.current.forEach((source) => source.cancel());
      activeRequests.current.clear();
    }
    queue.current = [];
    processing.current.clear();
    setLoading(false);
  }, []);

  const preload = useCallback(
    (url: string, config?: RequestConfig) => {
      request({ ...config, url, useCache: true });
    },
    [request]
  );

  const refresh = useCallback(
    (cacheKey: string) => {
      delete cache.current[cacheKey];
      return request({ cacheKey, useCache: true });
    },
    [request]
  );

  const reset = useCallback(() => {
    setData(null);
    setError(null);
    setProgress(0);
  }, []);

  // 清理
  useEffect(() => {
    return () => {
      cancel();
      window.clearTimeout(debounceTimer.current);
    };
  }, [cancel]);

  return {
    request,
    cancel,
    preload,
    refresh,
    reset,
    loading,
    error,
    data,
    progress,
    getCache: useCallback((key: string) => getCache(key), [getCache]),
    setCache: useCallback((key: string, data: any, ttl?: number) => setCache(key, data, ttl), [setCache])
  };
}
