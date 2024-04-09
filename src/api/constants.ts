import { typedGet } from '.';

import type { AxiosResponse } from 'axios';

export const getAllRegions = async () => {
  const response = await typedGet('/constants/regions');

  return response as unknown as AxiosResponse<Region[]>;
};

export const getAllGenders = async () => {
  const response = await typedGet('/constants/genders');

  return response as unknown as AxiosResponse<string[]>;
};

export type Region = {
  countryCode: string;
  englishName: string;
  koreanName: string;
  dialCode: number;
};
