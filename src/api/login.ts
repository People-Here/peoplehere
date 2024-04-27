import { typedGet, typedPost } from '.';
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

export const getNewToken = async (params: GetNewTokenRequest) => {
  const response = await typedGet<GetNewTokenResponse>('/account/token', { params });
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

type GetNewTokenRequest = {
  refreshToken: string;
};

type GetNewTokenResponse = {
  id: string;
  accessToken: string;
  refreshToken: string;
};
