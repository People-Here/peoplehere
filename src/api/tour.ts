import { Preferences } from '@capacitor/preferences';

import { typedGet, typedPost, typedPut } from '.';
import { parseJSONBigint } from '../utils/parse';

export const getTourList = async (region: string, lang: string, cursorId?: string, limit = 10) => {
  const { value } = await Preferences.get({ key: 'accessToken' });

  const response = await typedGet<TourListResponse>(`/tours/${region}/${lang}`, {
    transformResponse: [(data: string) => parseJSONBigint(data)],
    headers: {
      Authorization: value,
    },
    params: {
      cursorId,
      limit,
    },
  });
  return response;
};

export const getTourListByUser = async (
  region: string,
  lang: string,
  userId: string,
  cursorId?: string,
  limit = 10,
) => {
  const response = await typedGet<TourListResponse>(`/tours/${region}/${lang}/account/${userId}`, {
    transformResponse: [(data: string) => parseJSONBigint(data)],
    params: {
      cursorId,
      limit,
    },
  });
  return response;
};

export const getBookmarkList = async (
  region: string,
  lang: string,
  cursorId?: string,
  limit = 10,
) => {
  const { value } = await Preferences.get({ key: 'accessToken' });

  const response = await typedGet<BookmarkTourListResponse>(`/tours/like/${region}/${lang}`, {
    transformResponse: [(data: string) => parseJSONBigint(data)],
    headers: {
      Authorization: value,
    },
    params: {
      cursorId,
      limit,
    },
  });
  return response;
};

export const getTourDetail = async (tourId: string, region: string, lang: string) => {
  const { value } = await Preferences.get({ key: 'accessToken' });

  const requestRegion = lang === 'ENGLISH' ? 'US' : region;

  const response = await typedGet<TourDetail>(`/tours/${tourId}/${requestRegion}/${lang}`, {
    transformResponse: [(data: string) => parseJSONBigint(data)],
    headers: {
      Authorization: value,
    },
  });
  return response;
};

export const searchTour = async (keyword: string, region: string, langCode: string) => {
  const response = await typedPost<TourListResponse>(
    '/tours/search',
    {
      keyword,
      region,
      langCode,
    },
    { transformResponse: [(data: string) => parseJSONBigint(data)] },
  );
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

export const deleteTour = async (tourId: string, reason: string) => {
  const { value } = await Preferences.get({ key: 'accessToken' });

  const response = await typedPost(
    '/tours',
    { id: tourId, reason },
    {
      headers: { Authorization: value },
    },
  );

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
  theme: string;
  directMessageStatus: boolean;
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
    imageInfoList: { imageUrl: string; authorName?: string; authorUrl?: string }[];
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
    directMessageStatus: boolean;
  };
  title: string;
  description: string;
  placeInfo: {
    id: bigint;
    name: string;
    imageInfoList: { imageUrl: string; authorName?: string; authorUrl?: string }[];
    address: string;
    district: string;
    latitude: number;
    longitude: number;
  };
  like: boolean;
  theme: string;
  directMessageStatus: boolean;
};

export type Place = {
  id: string;
  name: string;
  imageInfoList: { imageUrl: string; authorName?: string; authorUrl?: string }[];
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
