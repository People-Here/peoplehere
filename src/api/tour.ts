import { typedGet, typedPost } from '.';

export const getTourList = async () => {
  const response = await typedGet<TourListResponse>('/tours/ORIGIN');
  return response;
};

export const searchTour = async (keyword: string) => {
  const response = await typedPost<TourListResponse>('/tours/search', { keyword });
  return response;
};

type TourListResponse = {
  tourList: Tour[];
};

export type Tour = {
  id: number;
  title: string;
  categoryList: { name: string }[];
  like: boolean;
  placeInfo: Place;
  userInfo: User;
};

export type Place = {
  id: string;
  name: string;
  imageUrlList: { imageUrl: string }[];
  district: string;
};

export type User = {
  id: number;
  firstName: string;
  lastName: string;
  profileImageUrl: string;
};
