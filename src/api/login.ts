import { typedGet } from '.';

export const login = async (req: LoginRequest) => {
  const response = await typedGet<LoginResponse>('/account/login', { params: req });
  return response.data;
};

export const getNewToken = async (req: GetNewTokenRequest) => {
  const response = await typedGet<GetNewTokenResponse>('/account/token', { params: req });
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
