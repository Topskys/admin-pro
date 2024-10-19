import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios';
import { ElMessage } from 'element-plus';
import { getMessageInfo } from './status';

interface BaseResponse<T = any> {
    code: number | string;
    data: T;
    message: string;
    status?: number | string;
}

// 创建axios实例
const service = axios.create({
    baseURL: import.meta.env.VITE_APP_API_BASEURL,
    timeout: 15000
});

// 请求拦截器
service.interceptors.request.use(
    (config) => {
        return config;
    },
    (error: AxiosError) => {
        return Promise.reject(error);
    }
);

// 响应拦截器
service.interceptors.response.use(
    (response) => {
        if (response.status === 200) {
            return response.data;
        }
        ElMessage.error(getMessageInfo(response.status));
        return response.data;
    },
    (error) => {
        const { response } = error;
        if (response) {
            ElMessage.error(getMessageInfo(response.status));
            return Promise.reject(response.data);
        }
        ElMessage.error('网络连接异常，请稍后再试！');
        return Promise.reject(error);
    }
);

export default service;

// 此处相当于二次响应拦截
// 为响应数据进行定制化处理
const requestInstance = <T = any>(config: AxiosRequestConfig): Promise<T> => {
    const conf = config;
    return new Promise((resolve, reject) => {
        service.request<any, AxiosResponse<BaseResponse>>(conf).then((res: AxiosResponse<BaseResponse>) => {
            const data = res.data; // 如果data.code为错误代码返回message信息
            if (data.code != 0) {
                ElMessage({
                    message: data.message,
                    type: 'error'
                });
                reject(data.message);
            } else {
                ElMessage({
                    message: data.message,
                    type: 'success'
                }); // 此处返回data信息 也就是 api 中配置好的 Response类型
                resolve(data.data as T);
            }
        });
    });
};
export function get<T = any, U = any>(config: AxiosRequestConfig, url: string, params?: U): Promise<T> {
    return requestInstance({ ...config, url, method: 'GET', params: params });
}
export function post<T = any, U = any>(config: AxiosRequestConfig, url: string, data: U): Promise<T> {
    return requestInstance({ ...config, url, method: 'POST', data: data });
}

export function put<T = any, U = any>(config: AxiosRequestConfig, url: string, params?: U): Promise<T> {
    return requestInstance({ ...config, url, method: 'PUT', params: params });
}
export function del<T = any, U = any>(config: AxiosRequestConfig, url: string, data: U): Promise<T> {
    return requestInstance({ ...config, url, method: 'DELETE', data: data });
}
