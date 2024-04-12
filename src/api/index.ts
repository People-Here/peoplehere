import axios from 'axios';

import type { AxiosRequestConfig } from 'axios';

const apiInstance = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL as string,
  responseType: 'json',
});

export const typedGet = async <T>(url: string, config?: AxiosRequestConfig) => {
  const response = await apiInstance.get<T>(url, config);
  return response;
};

export const typedPost = async <T>(url: string, body?: unknown, config?: AxiosRequestConfig) => {
  const response = await apiInstance.post<T>(url, body, config);
  return response;
};

export const typedPatch = async <T>(url: string, body?: unknown, config?: AxiosRequestConfig) => {
  const response = await apiInstance.patch<T>(url, body, config);
  return response;
};
