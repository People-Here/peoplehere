import { typedGet, typedPut } from '.';

export const getUserProfile = async (userId: string, region: string) => {
  const response = await typedGet<ProfileResponse>(`/user/${userId}/${region}`);
  return response;
};

export const updateUserProfile = async (body: UpdateProfileRequest) => {
  const response = await typedPut('/user', body);
  return response;
};

type ProfileResponse = {
  id: bigint;
  profileImageUrl: string;
  introduce: string;
  languages: string[];
  region: string;
  favorite?: string;
  hobby?: string;
  pet?: string;
  job?: string;
  school?: string;
  address?: string;
  birthDate?: string;
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
