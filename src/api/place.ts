import { Preferences } from '@capacitor/preferences';

import { typedGet } from '.';

export const getDefaultImages = async (placeId: string) => {
  const { value } = await Preferences.get({ key: 'accessToken' });

  const response = await typedGet<DefaultImageResponse>('/places/images', {
    params: { placeId },
    headers: {
      Authorization: value,
    },
  });
  return response;
};

type DefaultImageResponse = {
  authorName: string;
  authorUrl: string;
  imageUrl: string;
}[];
