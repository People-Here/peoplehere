import { typedGet } from '.';

export const getCities = async (keyword?: string) => {
  const response = await typedGet<CityResponse>(`/city?keyword=${keyword ?? ''}`);

  return response;
};

export type CityResponse = {
  cityList: {
    id: number;
    region: string;
    latitude: number;
    longitude: number;
    cityInfoList: [
      {
        name: string;
        langCode: string;
      },
      {
        name: string;
        langCode: string;
      },
    ];
  }[];
};
