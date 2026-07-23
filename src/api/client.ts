import axios, { type AxiosInstance, type InternalAxiosRequestConfig } from 'axios';
import { config } from '@config/index';
import { getCacheKey, getFromCache, setInCache, clearCache } from './cache';

const apiClient: AxiosInstance = axios.create({
  baseURL: config.api.baseUrl,
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use(
  (requestConfig: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem('auth_token');
    if (token) {
      requestConfig.headers.Authorization = `Bearer ${token}`;
    }

    if (requestConfig.method === 'get' && requestConfig.url) {
      const key = getCacheKey(requestConfig.url, requestConfig.params);
      const cached = getFromCache(key);
      if (cached) {
        requestConfig.adapter = () => {
          return Promise.resolve({
            data: cached,
            status: 200,
            statusText: 'OK',
            headers: {},
            config: requestConfig,
          });
        };
      }
    }

    return requestConfig;
  },
  (error) => Promise.reject(error)
);

apiClient.interceptors.response.use(
  (response) => {
    const method = response.config.method;
    if (method === 'get' && response.config.url) {
      const key = getCacheKey(response.config.url, response.config.params);
      setInCache(key, response.data);
    } else if (method && !['get', 'head', 'options'].includes(method)) {
      clearCache();
    }
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('auth_token');
      localStorage.removeItem('auth_user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export { apiClient, clearCache };
