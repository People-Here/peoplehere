import { Preferences } from '@capacitor/preferences';

import { typedGet, typedPut } from '.';

export const getUserProfile = async (userId: string, region: string) => {
  const response = await typedGet<ProfileResponse>(`/user/${userId}/${region}`);
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
