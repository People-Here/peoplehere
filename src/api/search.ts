import { Preferences } from '@capacitor/preferences';

import { typedGet, typedPost } from '.';

export const searchPlace = async (params: SearchPlaceRequest) => {
  const response = await typedGet<SearchPlaceResponse>('/places', { params });
  return response;
};

export const enrollPlace = async (body: EnrollPlaceRequest) => {
  const { value } = await Preferences.get({ key: 'accessToken' });

  const response = await typedPost<EnrollPlaceResponse>('/places', body, {
    headers: {
      Authorization: value,
    },
  });
  return response;
};

export const getSearchHistory = async (type: 'MAIN' | 'TOUR') => {
  const { value } = await Preferences.get({ key: 'accessToken' });

  const response = await typedGet<SearchHistory>(`/places/search-history/${type}`, {
    headers: {
      Authorization: value,
    },
  });

  return response;
};

type SearchPlaceRequest = {
  name: string;
  region: string;
};

export type SearchPlaceResponse = {
  predictions: Array<{
    placeId: string;
    structuredFormatting: {
      mainText: string;
    };
    description: string;
  }>;
  status: string;
};

export type SearchHistory = {
  places: {
    placeId: string;
    name: string;
    address: string;
  }[];
};

type EnrollPlaceRequest = {
  placeId: string;
  region: string;
  type: 'MAIN' | 'TOUR';
};

type EnrollPlaceResponse = {
  placeId: string;
  name: string;
  address: string;
  latitude: number;
  longitude: number;
};
