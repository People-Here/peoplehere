import { typedDelete, typedPost } from '.';

export const signUp = async (body: SignInRequest) => {
  const response = await typedPost('/account/sign-up', body);

  return response;
};

export const deleteAccount = async (userId: string) => {
  const response = await typedDelete(`/account/${userId}`);

  return response;
};

export type SignInRequest = {
  firstName: string;
  lastName: string;
  birthDate: string;
  gender: string;
  email: string;
  password: string;
  region: string;
  phoneNumber: string;
  privacyConsent: boolean;
  marketingConsent: boolean;
};
