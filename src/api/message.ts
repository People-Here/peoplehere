import { Preferences } from '@capacitor/preferences';
import JSONbig from 'json-bigint';

import { typedGet, typedPost, typedPut } from '.';

export const getMessageRooms = async (langCode: string) => {
  const { value: token } = await Preferences.get({ key: 'accessToken' });

  const response = await typedGet<MessageRoomsResponse>(`/tours/messages/${langCode}`, {
    transformResponse: [(data: string) => JSONbig.parse(data) as JSON],
    headers: {
      Authorization: token,
    },
  });

  return response;
};

export const getMessages = async (tourId: string, langCode: string) => {
  const { value: token } = await Preferences.get({ key: 'accessToken' });

  const response = await typedPut<Message>(
    `/tours/messages/${tourId}/${langCode}`,
    {},
    {
      headers: {
        Authorization: token,
      },
      transformResponse: [(data: string) => JSONbig.parse(data) as JSON],
    },
  );

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

export const translateMessage = async (content: string, language: string) => {
  const { value } = await Preferences.get({ key: 'accessToken' });

  const response = await typedPost<TranslateResult>(
    '/tours/message/translate',
    { content, language },
    {
      headers: {
        Authorization: value,
      },
    },
  );

  return response;
};

export const changeMessageReceiveStatus = async (tourId: string, consent: boolean) => {
  const { value } = await Preferences.get({ key: 'accessToken' });

  const response = await typedPost(
    '/tours/messages/status',
    { id: tourId, consent },
    {
      headers: {
        Authorization: value,
      },
    },
  );

  return response;
};

export type MessageRoom = {
  id: bigint;
  tourId: bigint;
  title: string;
  lastMessage: string;
  readFlag: boolean;
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
    languages: string[];
  };
  guestInfo: {
    id: bigint;
    firstName: string;
    lastName: string;
    introduce: string;
    profileImageUrl: string;
    directMessageStatus: boolean;
    languages: string[];
  };
  messageInfoList: {
    senderId: bigint;
    receiverId: bigint;
    messageId: bigint;
    message: string;
    createdAt: string;
    readFlag: boolean;
  }[];
};

type TranslateResult = {
  content: string;
  language: string;
};
