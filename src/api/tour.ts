import { Preferences } from '@capacitor/preferences';
import JSONbig from 'json-bigint';

import { typedDelete, typedGet, typedPost, typedPut } from '.';

export const getTourList = async (region: string, lang: string) => {
  const { value } = await Preferences.get({ key: 'accessToken' });

  const response = await typedGet<TourListResponse>(`/tours/${region}/${lang}`, {
    transformResponse: [(data: string) => JSONbig.parse(data) as JSON],
    headers: {
      Authorization: value,
    },
  });
  return response;
};

export const getTourListByUser = async (region: string, lang: string, userId: string) => {
  const response = await typedGet<TourListResponse>(`/tours/${region}/${lang}/account/${userId}`, {
    transformResponse: [(data: string) => JSONbig.parse(data) as JSON],
  });
  return response;
};

export const getBookmarkList = async (region: string, lang: string) => {
  const { value } = await Preferences.get({ key: 'accessToken' });

  const response = await typedGet<BookmarkTourListResponse>(`/tours/like/${region}/${lang}`, {
    transformResponse: [(data: string) => JSONbig.parse(data) as JSON],
    headers: {
      Authorization: value,
    },
  });
  return response;
};

export const getTourDetail = async (tourId: string, region: string) => {
  const response = await typedGet<TourDetail>(`/tours/${tourId}/${region}/ORIGIN`, {
    transformResponse: [(data: string) => JSONbig.parse(data) as JSON],
  });
  return response;
};

export const searchTour = async (keyword: string, region: string, langCode: string) => {
  const response = await typedPost<TourListResponse>('/tours/search', {
    keyword,
    region,
    langCode,
  });
  return response;
};

export const postTour = async (body: FormData) => {
  const { value } = await Preferences.get({ key: 'accessToken' });

  const response = await typedPost('/tours', body, {
    withCredentials: true,
    headers: {
      Authorization: value,
      'Content-Type': 'multipart/form-data',
    },
  });
  return response;
};

export const editTour = async (body: FormData) => {
  const { value } = await Preferences.get({ key: 'accessToken' });

  const response = await typedPut('/tours', body, {
    headers: {
      Authorization: value,
    },
  });

  return response;
};

export const likeTour = async (tourId: string) => {
  const { value } = await Preferences.get({ key: 'accessToken' });

  const response = await typedPost(
    '/tours/like',
    {
      id: tourId,
    },
    {
      headers: {
        Authorization: value,
      },
    },
  );

  return response;
};

export const deleteTour = async (tourId: string) => {
  const { value } = await Preferences.get({ key: 'accessToken' });

  const response = await typedDelete('/tours', {
    data: { id: tourId },
    headers: { Authorization: value },
  });

  return response;
};

type TourListResponse = {
  tourList: Tour[];
};

type BookmarkTourListResponse = {
  tourList: BookmarkedTour[];
};

export type Tour = {
  id: string;
  title: string;
  categoryList: { name: string }[];
  like: boolean;
  placeInfo: Place;
  userInfo: User;
};

export type BookmarkedTour = {
  id: string;
  title: string;
  description: string;
  like: boolean;
  theme: string;
  placeInfo: {
    name: string;
    isDefaultImage: boolean;
    imageUrlList: { imageUrl: string }[];
    district: string;
    id: string;
  };
  userInfo: {
    id: bigint;
    firstName: string;
    lastName: string;
    profileImageUrl: string;
    languages: string[];
    introduce: string;
    directMessageStatus: boolean;
  };
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
    id: bigint;
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
