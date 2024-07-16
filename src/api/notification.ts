import { Preferences } from '@capacitor/preferences';

import { typedPost } from '.';

export const sendNotification = async () => {
  const fcmToken = await Preferences.get({ key: 'fcmToken' });
  const deviceId = await Preferences.get({ key: 'DeviceId' });
  const accessToken = await Preferences.get({ key: 'accessToken' });

  const response = await typedPost(
    '/notify/token',
    {
      token: fcmToken.value,
      deviceId: deviceId.value,
    },
    {
      headers: {
        Authorization: accessToken.value,
      },
    },
  );

  return response;
};
