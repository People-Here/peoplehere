import { Preferences } from '@capacitor/preferences';
import JSONbig from 'json-bigint';

import { typedGet, typedPut } from '.';

export const getUserProfile = async (userId: string, region: string) => {
  const response = await typedGet<ProfileResponse>(`/user/${userId}/${region}`, {
    transformResponse: [(data: string) => JSONbig.parse(data) as JSON],
  });
  return response;
};

export const updateUserProfile = async (body: FormData) => {
  const { value } = await Preferences.get({ key: 'accessToken' });

  const response = await typedPut('/user', body, {
    headers: {
      Authorization: `${value}`,
    },
  });
  return response;
};

export const updateUserName = async (firstName: string, lastName: string) => {
  const { value } = await Preferences.get({ key: 'accessToken' });

  const response = await typedPut(
    '/account/name',
    { firstName, lastName },
    {
      headers: {
        Authorization: value,
      },
    },
  );

  return response;
};

export const updateUserEmail = async (email: string) => {
  const { value } = await Preferences.get({ key: 'accessToken' });

  const response = await typedPut(
    '/account/email',
    { email },
    {
      headers: {
        Authorization: value,
      },
    },
  );

  return response;
};

export type ProfileResponse = {
  id: string;
  profileImageUrl: string;
  introduce: string;
  languages: string[];
  region: string;
  firstName: string;
  lastName: string;
  birthDate: string;
  favorite?: string;
  hobby?: string;
  pet?: string;
  job?: string;
  school?: string;
  address?: string;
  langCode?: string;
};

export type UpdateProfileRequest = {
  id: string;
  profileImage: string;
  introduce: string;
  region: string;
  languages: string[];
  favorite?: string;
  hobby?: string;
  pet?: string;
  job?: string;
  school?: string;
  address?: string;
  birthDate?: string;
  placeId: string;
};
