import { typedPost } from '.';

type Props = {
  userId: string;
  message: string;
};

export const reportUser = async ({ userId, message }: Props) => {
  const response = await typedPost('/user/report', { userId, message });
  return response;
};

export const blockUser = async ({ userId, message }: Props) => {
  const response = await typedPost('/user/block', { userId, message });
  return response;
};
