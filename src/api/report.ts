import { Preferences } from '@capacitor/preferences';

import { typedPost } from '.';

type Props = {
  userId: string;
  message: string;
};

export const reportUser = async ({ userId, message }: Props) => {
  const { value } = await Preferences.get({ key: 'accessToken' });

  const response = await typedPost(
    '/account/report',
    { accountId: userId, message },
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
    '/account/block',
    { accountId: userId, message },
    {
      headers: {
        Authorization: value,
      },
    },
  );
  return response;
};

type ReportPostProps = {
  tourId: string;
  message: string;
};
export const reportPost = async ({ tourId, message }: ReportPostProps) => {
  const { value } = await Preferences.get({ key: 'accessToken' });

  const response = await typedPost(
    '/tours/report',
    { tourId, message },
    {
      headers: {
        Authorization: value,
      },
    },
  );
  return response;
};
