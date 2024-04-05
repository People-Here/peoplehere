import axios from 'axios';

import type { AxiosRequestConfig, AxiosResponse } from 'axios';

const apiInstance = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL as string,
  responseType: 'json',
});

export const typedGet = async <T>(url: string, config?: AxiosRequestConfig) => {
  const response = await apiInstance.get<AxiosResponse<T>>(url, config);
  return response.data;
};

export const typedPost = async <T>(url: string, body?: unknown, config?: AxiosRequestConfig) => {
  const response = await apiInstance.post<AxiosResponse<T>>(url, body, config);
  return response.data;
};

export const typedPatch = async <T>(url: string, body?: unknown, config?: AxiosRequestConfig) => {
  const response = await apiInstance.patch<AxiosResponse<T>>(url, body, config);
  return response.data;
};
