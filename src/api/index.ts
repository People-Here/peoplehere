import axios from 'axios';

import type { AxiosRequestConfig } from 'axios';

const apiInstance = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL as string,
  withCredentials: false,
});

// config
apiInstance.defaults.timeout = 5000;

// interceptors
// apiInstance.interceptors.request.use(
//   async (config) => {
//     const { value } = await Preferences.get({ key: 'DeviceId' });

//     config.headers.Identifier = value;

//     return config;
//   },
//   (error) => {
//     return Promise.reject(error);
//   },
//   { synchronous: true },
// );

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
