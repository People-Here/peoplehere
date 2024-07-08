import { typedGet, typedPost } from '.';

export const checkEmail = async (email: string) => {
  const response = await typedGet(`/account/email/check?email=${email}`);
  return response;
};

export const checkEmailExist = async (email: string) => {
  const response = await typedGet('/account/email/exist', { params: { email } });
  return response;
};

export const sendEmailCode = async (email: string, lang: string) => {
  const response = await typedPost<SendEmailResponse>('/account/email/verification', {
    email,
    langCode: lang,
  });

  return response;
};

export const verifyEmailCode = async (email: string, code: string) => {
  const response = await typedPost('/account/email/verify', { email, code });
  return response;
};

export const sendPhoneCode = async (region: string, phone: string, lang: string) => {
  const response = await typedPost('/account/phone/verification', {
    region,
    phoneNumber: phone,
    langCode: lang,
  });
  return response;
};

export const verifyPhoneCode = async (phone: string, code: string, region: string) => {
  const response = await typedPost('/account/phone/verify', { phoneNumber: phone, code, region });
  return response;
};

type SendEmailResponse = {
  expireTime: string;
};
