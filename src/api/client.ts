import axios, { type AxiosInstance, type InternalAxiosRequestConfig } from 'axios';
import { config } from '@config/index';
import { getCacheKey, getFromCache, setInCache, invalidateCache, DEFAULT_TTL, PROFILE_TTL } from './cache';

function getTtlForUrl(url: string): number {
  if (url.includes('/user/') || url.includes('/auth/')) return PROFILE_TTL;
  if (url.includes('/settings')) return PROFILE_TTL;
  if (url.includes('/meal-plans/')) return PROFILE_TTL;
  return DEFAULT_TTL;
}

function getInvalidationPattern(url: string): string | undefined {
  if (url.includes('/user/profile')) return '/user/profile';
  if (url.includes('/user/settings')) return '/user/settings';
  if (url.includes('/meal-plans/')) return '/meal-plans/';
  if (url.includes('/nutrition/log')) return '/nutrition/';
  if (url.includes('/nutrition/water')) return '/nutrition/';
  if (url.includes('/onboarding/')) return '/user/profile';
  if (url.includes('/insights/')) return '/insights/';
  if (url.includes('/recipes/')) return '/recipes/';
  if (url.includes('/subscriptions/')) return '/subscriptions/';
  return undefined;
}

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
      const ttl = getTtlForUrl(requestConfig.url);
      const cached = getFromCache(key, ttl);
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
      const ttl = getTtlForUrl(response.config.url);
      setInCache(key, response.data, ttl);
    } else if (method && !['get', 'head', 'options'].includes(method) && response.config.url) {
      const pattern = getInvalidationPattern(response.config.url);
      invalidateCache(pattern);
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

export { apiClient };
