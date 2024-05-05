import { Preferences } from '@capacitor/preferences';

import { typedPost } from '.';
import { parseBigint } from '../utils/parse';

export const signIn = async (params: LoginRequest) => {
  const response = await typedPost<LoginResponse>(
    '/account/sign-in',
    { ...params },
    {
      transformResponse: [(data: string) => parseBigint(data)],
    },
  );
  return response;
};

export const getNewToken = async () => {
  const accessToken = await Preferences.get({ key: 'accessToken' });
  const refreshToken = await Preferences.get({ key: 'refreshToken' });

  const response = await typedPost<string>('/account/token', {
    accessToken: accessToken.value,
    refreshToken: refreshToken.value,
  });
  return response;
};

type LoginRequest = {
  email: string;
  password: string;
};

type LoginResponse = {
  accessToken: string;
  refreshToken: string;
  id: string;
};
