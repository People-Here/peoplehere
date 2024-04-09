import { typedGet } from '.';

import type { AxiosResponse } from 'axios';

export const searchPlace = async (params: SearchPlaceRequest) => {
  const response = await typedGet('/places', { params });
  return response as unknown as AxiosResponse<SearchPlaceResponse>;
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
