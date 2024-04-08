import { typedGet } from '.';

import type { AxiosResponse } from 'axios';

export const getTourList = async () => {
  const response = await typedGet('/tours');
  return response as unknown as AxiosResponse<TourListResponse>;
};

type TourListResponse = {
  tourList: Tour[];
};

export type Tour = {
  id: number;
  title: string;
  categoryList: string[];
  like: boolean;
  placeInfo: Place;
  userInfo: User;
};

export type Place = {
  placeId: string;
  name: string;
  imageUrlList: string[];
  district: string;
};

export type User = {
  accountId: number;
  firstName: string;
  lastName: string;
  profileImageUrl: string;
};
