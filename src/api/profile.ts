import { Preferences } from '@capacitor/preferences';

import { typedGet, typedPut } from '.';

export const getUserProfile = async (userId: string, region: string) => {
  const { value } = await Preferences.get({ key: 'accessToken' });
  const response = await typedGet<ProfileResponse>(`/user/${userId}/${region}`, {
    headers: {
      Authorization: `Bearer ${value}`,
    },
  });
  return response;
};

export const updateUserProfile = async (body: UpdateProfileRequest) => {
  const response = await typedPut('/user', body);
  return response;
};

export type ProfileResponse = {
  id: bigint;
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
  profileImageUrl: string;
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
