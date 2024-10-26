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
  baseURL: import.meta.env.VITE_APP_USE_MOCK
    ? import.meta.env.VITE_APP_MOCK_BASEURL
    : import.meta.env.VITE_APP_API_BASEURL,
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
      const data = response.data;
      if (data.code !== 0) {
        ElMessage.error(data?.message);
        return Promise.reject(data);
      } else {
        return data;
      }
    }
    ElMessage.error(getMessageInfo(response.status));
    return response;
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
