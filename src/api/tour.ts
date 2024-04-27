import { Preferences } from '@capacitor/preferences';

import { typedGet, typedPost } from '.';

export const getTourList = async () => {
  const response = await typedGet<TourListResponse>('/tours/ORIGIN');
  return response;
};

export const searchTour = async (keyword: string, langCode: string) => {
  const response = await typedPost<TourListResponse>('/tours/search', { keyword, langCode });
  return response;
};

export const postTour = async (body: NewTourRequest) => {
  const { value } = await Preferences.get({ key: 'accessToken' });

  const response = await typedPost('/tours', body, {
    withCredentials: true,
    headers: {
      Authorization: value,
    },
  });
  return response;
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

export type NewTourRequest = {
  placeId: string;
  images: File[];
  title: string;
  description: string;
  theme: string;
};
