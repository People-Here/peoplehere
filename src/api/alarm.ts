import { Preferences } from '@capacitor/preferences';

import { typedPost } from '.';

export const updateAlarmStatus = async (props: AlarmRequest) => {
  const { value } = await Preferences.get({ key: 'accessToken' });

  const response = await typedPost(
    '/account/alarm',
    { alarm: props.type, consent: props.consent },
    {
      headers: {
        Authorization: value,
      },
    },
  );

  return response;
};

export type AlarmType = 'MESSAGE' | 'MARKETING' | 'PRIVACY';

type AlarmRequest = {
  type: AlarmType;
  consent: boolean;
};
