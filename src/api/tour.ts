import { Preferences } from '@capacitor/preferences';
import JSONbig from 'json-bigint';

import { typedGet, typedPost } from '.';

export const getTourList = async () => {
  const response = await typedGet<TourListResponse>('/tours/ORIGIN', {
    transformResponse: [(data: string) => JSONbig.parse(data)],
  });
  return response;
};

export const getTourDetail = async (tourId: string, region: string) => {
  const response = await typedGet<TourDetail>(`/tours/${tourId}/${region}`);
  return response;
};

export const searchTour = async (keyword: string, langCode: string) => {
  const response = await typedPost<TourListResponse>('/tours/search', { keyword, langCode });
  return response;
};

export const postTour = async (body: FormData) => {
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
  id: string;
  title: string;
  categoryList: { name: string }[];
  like: boolean;
  placeInfo: Place;
  userInfo: User;
};

export type TourDetail = {
  userInfo: {
    id: string;
    firstName: string;
    lastName: string;
    profileImageUrl: string;
    languages: string[];
    introduce: string;
  };
  title: string;
  description: string;
  placeInfo: {
    placeId: string;
    name: string;
    imageUrlList: { imageUrl: string }[];
    address: string;
  };
  like: boolean;
  available: boolean;
  theme: string;
};

export type Place = {
  id: string;
  name: string;
  imageUrlList: { imageUrl: string }[];
  district: string;
};

export type User = {
  id: string;
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
