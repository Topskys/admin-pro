// useAxios.ts
import axios, {
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
  AxiosError,
  CancelTokenSource,
  mergeConfig
} from 'axios';
import { ref, reactive, onUnmounted, watchEffect } from 'vue';

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

interface HookOptions {
  concurrency?: number;
  debounce?: number;
  immediate?: boolean;
  defaultRetry?: number;
  defaultRetryDelay?: number;
  cacheEnabled?: boolean;
  interceptors?: {
    request?: ((config: AxiosRequestConfig) => AxiosRequestConfig | Promise<AxiosRequestConfig>)[];
    response?: ((response: AxiosResponse) => AxiosResponse | Promise<AxiosResponse>)[];
    error?: (error: AxiosError) => Promise<never>;
  };
}

interface CacheItem {
  timestamp: number;
  data: any;
  ttl?: number;
}

export function useAxios<T = any>(axiosConfig: AxiosRequestConfig = {}, hookOptions: HookOptions = {}) {
  // 配置处理
  const {
    concurrency = 5,
    debounce = 0,
    immediate = true,
    defaultRetry = 0,
    defaultRetryDelay = 1000,
    cacheEnabled = false,
    interceptors
  } = hookOptions;

  // 创建 Axios 实例
  const instance = axios.create(axiosConfig);

  // 响应式状态
  const loading = ref(false);
  const error = ref<AxiosError<T> | null>(null);
  const data = ref<T | null>(null);
  const progress = ref(0);

  // 请求管理
  const activeRequests = new Set<CancelTokenSource>();
  const queue = reactive<
    Array<{
      config: RequestConfig;
      resolve: (value: any) => void;
      reject: (reason?: any) => void;
      cancel?: CancelTokenSource;
    }>
  >([]);
  const processing = reactive(new Set<Promise<any>>());
  const retryCounts = reactive(new Map<Promise<any>, number>());
  const cache = reactive(new Map<string, CacheItem>());

  // 拦截器管理
  const registerInterceptors = () => {
    const interceptorIds = {
      request: [] as number[],
      response: [] as number[]
    };

    if (interceptors?.request) {
      interceptors.request.forEach((fn) => {
        const id = instance.interceptors.request.use(fn);
        interceptorIds.request.push(id);
      });
    }

    if (interceptors?.response) {
      interceptors.response.forEach((fn) => {
        const id = instance.interceptors.response.use(
          (response) => fn(response),
          (err) => interceptors.error?.(err) ?? Promise.reject(err)
        );
        interceptorIds.response.push(id);
      });
    }

    return () => {
      interceptorIds.request.forEach((id) => instance.interceptors.request.eject(id));
      interceptorIds.response.forEach((id) => instance.interceptors.response.eject(id));
    };
  };

  // 缓存管理
  const getCache = (key: string) => {
    const item = cache.get(key);
    if (!item) return null;
    if (item.ttl && Date.now() - item.timestamp > item.ttl) {
      cache.delete(key);
      return null;
    }
    return item.data;
  };

  const setCache = (key: string, data: any, ttl?: number) => {
    cache.set(key, { timestamp: Date.now(), data, ttl });
  };

  // 队列处理
  const processQueue = async () => {
    while (queue.length > 0 && processing.size < concurrency) {
      const item = queue.shift()!;
      const mergedConfig = mergeConfig(instance.defaults, axiosConfig, item.config) as RequestConfig;

      // 依赖处理
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
      activeRequests.add(source);

      // 进度处理
      const handleProgress = (type: 'upload' | 'download') => (e: ProgressEvent) => {
        if (!e.total) return;
        const percent = Math.round((e.loaded * 100) / e.total);
        mergedConfig.progress?.(percent) || (progress.value = percent);
      };

      const promise = instance({
        ...mergedConfig,
        cancelToken: source.token,
        onUploadProgress: handleProgress('upload'),
        onDownloadProgress: handleProgress('download')
      })
        .then((response) => {
          if (mergedConfig.useCache && mergedConfig.cacheKey) {
            setCache(mergedConfig.cacheKey, response.data, mergedConfig.cacheTTL);
          }
          data.value = response.data;
          return response.data;
        })
        .catch(async (err: AxiosError<T>) => {
          error.value = err;
          const handledError = await (interceptors?.error?.(err) ?? Promise.reject(err));

          const retry = mergedConfig.retry ?? defaultRetry;
          const retryDelay = mergedConfig.retryDelay ?? defaultRetryDelay;
          const count = retryCounts.get(promise) ?? 0;

          if (count < retry && !axios.isCancel(handledError)) {
            retryCounts.set(promise, count + 1);
            await new Promise((r) => setTimeout(r, retryDelay));
            queue.unshift(item);
            processQueue();
            return;
          }

          throw handledError;
        })
        .finally(() => {
          processing.delete(promise);
          activeRequests.delete(source);
          retryCounts.delete(promise);
          if (processing.size === 0 && queue.length === 0) {
            loading.value = false;
            progress.value = 0;
          }
        });

      processing.add(promise);
      loading.value = true;
      promise.then(item.resolve).catch(item.reject);
    }
  };

  // 防抖处理
  let debounceTimer: number | null = null;
  const debounceRequest = (config: RequestConfig) => {
    return new Promise<T>((resolve, reject) => {
      const execute = () => {
        queue.push({
          config,
          resolve,
          reject,
          cancel: axios.CancelToken.source()
        });
        processQueue();
      };

      if (debounce > 0) {
        if (immediate && !debounceTimer) {
          execute();
        }
        if (debounceTimer) clearTimeout(debounceTimer);
        debounceTimer = window.setTimeout(() => {
          if (!immediate) execute();
          debounceTimer = null;
        }, debounce);
      } else {
        execute();
      }
    });
  };

  // 取消请求
  const cancel = (cancelKey?: string) => {
    if (cancelKey) {
      const request = queue.find((i) => i.config.cancelKey === cancelKey);
      request?.cancel?.cancel();
    } else {
      activeRequests.forEach((source) => source.cancel());
      activeRequests.clear();
    }
    queue.splice(0, queue.length);
    processing.clear();
    loading.value = false;
  };

  // 辅助方法
  const preload = (url: string, config?: RequestConfig) => {
    return debounceRequest({ ...config, url, useCache: true });
  };

  const refresh = (cacheKey: string) => {
    cache.delete(cacheKey);
    return debounceRequest({ cacheKey, useCache: true });
  };

  const reset = () => {
    data.value = null;
    error.value = null;
    progress.value = 0;
  };

  // 生命周期
  const cleanup = registerInterceptors();
  onUnmounted(() => {
    cleanup();
    cancel();
    if (debounceTimer) {
      clearTimeout(debounceTimer);
    }
  });

  // 自动处理队列
  watchEffect(() => {
    if (queue.length > 0 && processing.size < concurrency) {
      processQueue();
    }
  });

  return {
    request: debounceRequest,
    cancel,
    preload,
    refresh,
    reset,
    loading,
    error,
    data,
    progress,
    getCache,
    setCache
  };
}
