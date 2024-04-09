import { typedGet, typedPost } from '.';

import type { AxiosResponse } from 'axios';

export const getTourList = async () => {
  const response = await typedGet('/tours');
  return response as unknown as AxiosResponse<TourListResponse>;
};

export const searchTour = async (keyword: string) => {
  const response = await typedPost('/tours/search', { keyword });
  return response as unknown as AxiosResponse<TourListResponse>;
};

type TourListResponse = {
  tourList: Tour[];
};

export type Tour = {
  id: number;
  title: string;
  categoryList: { name: string }[];
  like: boolean;
  placeInfo: Place;
  userInfo: User;
};

export type Place = {
  id: string;
  name: string;
  imageUrlList: { imageUrl: string }[];
  district: string;
};

export type User = {
  id: number;
  firstName: string;
  lastName: string;
  profileImageUrl: string;
};
