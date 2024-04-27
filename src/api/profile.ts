import { typedGet } from '.';

export const getUserProfile = async (userId: string, region: string) => {
  const response = await typedGet<ProfileResponse>(`/user/${userId}/${region}`);
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
