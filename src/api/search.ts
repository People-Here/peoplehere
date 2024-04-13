import { typedGet } from '.';

export const searchPlace = async (params: SearchPlaceRequest) => {
  const response = await typedGet<SearchPlaceResponse>('/places', { params });
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
