import { Preferences } from '@capacitor/preferences';
import JSONbig from 'json-bigint';

import { typedGet, typedPost } from '.';

export const getMessageRooms = async () => {
  const { value: token } = await Preferences.get({ key: 'accessToken' });

  const response = await typedGet<MessageRoomsResponse>(`/tours/messages/KOREAN`, {
    transformResponse: [(data: string) => JSONbig.parse(data) as JSON],
    headers: {
      Authorization: token,
    },
  });

  return response;
};

export const getMessages = async (tourId: string, langCode: string) => {
  const { value: token } = await Preferences.get({ key: 'accessToken' });

  const response = await typedGet<Message>(`/tours/messages/${tourId}/${langCode}`, {
    headers: {
      Authorization: token,
    },
    transformResponse: [(data: string) => JSONbig.parse(data) as JSON],
  });

  return response;
};

export const postMessage = async (body: SendMessageRequest) => {
  const { value } = await Preferences.get({ key: 'accessToken' });

  const response = await typedPost('/tours/messages', body, {
    headers: {
      Authorization: value,
    },
  });

  return response;
};

export type MessageRoom = {
  id: bigint;
  tourId: bigint;
  title: string;
  lastMessage: string;
  guestInfo: {
    id: bigint;
    firstName: string;
    lastName: string;
    introduce: string;
    profileImageUrl: string;
    directMessageStatus: boolean;
  };
  ownerInfo: {
    id: bigint;
    firstName: string;
    lastName: string;
    introduce: string;
    profileImageUrl: string;
    directMessageStatus: boolean;
  };
};

type MessageRoomsResponse = {
  tourRoomList: MessageRoom[];
};

type SendMessageRequest = {
  tourId: string;
  receiverId: string;
  message: string;
};

export type Message = {
  tourId: bigint;
  tourRoomId: bigint;
  title: string;
  ownerInfo: {
    id: bigint;
    firstName: string;
    lastName: string;
    introduce: string;
    profileImageUrl: string;
    directMessageStatus: boolean;
  };
  guestInfo: {
    id: bigint;
    firstName: string;
    lastName: string;
    introduce: string;
    profileImageUrl: string;
    directMessageStatus: boolean;
  };
  messageList: {
    senderId: bigint;
    receiverId: bigint;
    message: string;
    createdAt: Date;
  }[];
};
