import { Preferences } from '@capacitor/preferences';

import { typedPost } from '.';

export const signUp = async (body: SignInRequest) => {
  const response = await typedPost('/account/sign-up', body);

  return response;
};

export const postAlarmAgreement = async (consent: boolean) => {
  const response = await typedPost('/account/alarm', { consent });

  return response;
};

export const deleteAccount = async (userId: string, reason: string) => {
  const { value } = await Preferences.get({ key: 'accessToken' });

  const response = await typedPost(
    `/account/deactivate`,
    {
      id: userId,
      reason,
    },
    {
      headers: {
        Authorization: value,
      },
    },
  );

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
  alarmConsent: boolean;
};
