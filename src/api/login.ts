import { typedGet } from '.';

export const login = async (params: LoginRequest) => {
  const response = await typedGet<LoginResponse>('/account/login', { params });
  return response.data;
};

export const getNewToken = async (params: GetNewTokenRequest) => {
  const response = await typedGet<GetNewTokenResponse>('/account/token', { params });
  return response.data;
};

type LoginRequest = {
  email: string;
  password: string;
};

type LoginResponse = {
  accessToken: string;
  refreshToken: string;
};

type GetNewTokenRequest = {
  refreshToken: string;
};

type GetNewTokenResponse = {
  id: string;
  accessToken: string;
  refreshToken: string;
};
