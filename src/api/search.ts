import { typedGet, typedPost } from '.';

export const searchPlace = async (params: SearchPlaceRequest) => {
  const response = await typedGet<SearchPlaceResponse>('/places', { params });
  return response;
};

export const enrollPlace = async (body: EnrollPlaceRequest) => {
  const response = await typedPost<EnrollPlaceResponse>('/places', body);
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

type EnrollPlaceRequest = {
  placeId: string;
  region: string;
};

type EnrollPlaceResponse = {
  placeId: string;
  name: string;
  address: string;
};
