import axios from 'axios';

import type { AxiosRequestConfig } from 'axios';

const apiInstance = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL as string,
  withCredentials: true,
  timeout: 60000,
  responseType: 'json',
});

// interceptors
// apiInstance.interceptors.response.use((response) => {
//   console.log('api success', response);
//   return response;
// }, onAxiosErrorResponse);

// types
export const typedGet = async <T>(url: string, config?: AxiosRequestConfig) => {
  const response = await apiInstance.get<T>(url, config);
  return response;
};

export const typedPost = async <T>(url: string, body?: unknown, config?: AxiosRequestConfig) => {
  const response = await apiInstance.post<T>(url, body, config);
  return response;
};

export const typedPut = async <T>(url: string, body?: unknown, config?: AxiosRequestConfig) => {
  const response = await apiInstance.put<T>(url, body, config);
  return response;
};

export const typedDelete = async <T>(url: string, config?: AxiosRequestConfig) => {
  const response = await apiInstance.delete<T>(url, config);
  return response;
};
