import { Preferences } from '@capacitor/preferences';

import { typedPost } from '.';

export const postMessage = async (body: SendMessageRequest) => {
  const { value } = await Preferences.get({ key: 'accessToken' });

  const response = await typedPost('/tours/messages', body, {
    headers: {
      Authorization: value,
    },
  });

  return response;
};

type SendMessageRequest = {
  tourId: string;
  receiverId: string;
  message: string;
};
