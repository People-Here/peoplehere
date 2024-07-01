import { typedGet } from '.';

export const getAllRegions = async () => {
  const response = await typedGet<Region[]>('/constants/regions');

  return response;
};

export const getAllGenders = async () => {
  const response = await typedGet<string[]>('/constants/genders');

  return response;
};

export const getAllLanguages = async () => {
  const response = await typedGet<Language[]>('/constants/langs');

  return response;
};

export type Region = {
  countryCode: string;
  englishName: string;
  koreanName: string;
  dialCode: string;
};

export type Language = {
  langCode: string;
  englishName: string;
  koreanName: string;
  code: string;
};
