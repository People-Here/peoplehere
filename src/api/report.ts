import { Preferences } from '@capacitor/preferences';

import { typedPost } from '.';

type Props = {
  userId: string;
  message: string;
};

export const reportUser = async ({ userId, message }: Props) => {
  const { value } = await Preferences.get({ key: 'accessToken' });

  const response = await typedPost(
    '/user/report',
    { userId, message },
    {
      headers: {
        Authorization: value,
      },
    },
  );
  return response;
};

export const blockUser = async ({ userId, message }: Props) => {
  const { value } = await Preferences.get({ key: 'accessToken' });

  const response = await typedPost(
    '/user/block',
    { userId, message },
    {
      headers: {
        Authorization: value,
      },
    },
  );
  return response;
};
