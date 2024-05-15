import { IonContent, IonImg, IonPage, IonToolbar, useIonRouter } from '@ionic/react';
import { useLayoutEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

import useLogin from '../hooks/useLogin';
import { getUserProfile } from '../api/profile';
import useUserStore from '../stores/user';
import useSignInStore from '../stores/signIn';
import { getNewToken } from '../api/login';
import { getMessageRooms } from '../api/message';

import type { AxiosError } from 'axios';
import type { MessageRoom } from '../api/message';

const MessageTab = () => {
  const { t } = useTranslation();

  const router = useIonRouter();

  const { checkLogin } = useLogin();
  const user = useUserStore((state) => state.user);
  const region = useSignInStore((state) => state.region);

  const [messages, setMessages] = useState<MessageRoom[]>([]);

  useLayoutEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    (async () => {
      const isLoggedIn = await checkLogin();
      if (!isLoggedIn) {
        return;
      }

      const profileInfo = await getUserProfile(user.id, region.countryCode.toUpperCase());

      if (
        !profileInfo.data.introduce ||
        !profileInfo.data.profileImageUrl ||
        !profileInfo.data.languages.length
      ) {
        router.push('/edit-profile', 'forward', 'replace');
      }
    })();
  }, [checkLogin, router, user.id, region.countryCode]);

  useLayoutEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    (async () => {
      try {
        const response = await getMessageRooms();
        setMessages(response.data.tourRoomList);
      } catch (error) {
        const errorInstance = error as AxiosError;

        if (errorInstance.response?.status === 401) {
          await getNewToken();

          const response = await getMessageRooms();
          setMessages(response.data.tourRoomList);
        }
      }
    })();
  }, []);

  return (
    <IonPage>
      <IonContent fullscreen>
        <IonToolbar className="px-4 bg-white h-14">
          <p className="pl-0 font-headline3 text-gray8">{t('message.title')}</p>
        </IonToolbar>

        {messages.length === 0 ? (
          <div className="flex flex-col gap-1.5 items-center justify-center w-full h-full text-center">
            <p className="text-black font-headline2">{t('message.noMessage')}</p>
            <p className="font-body1 text-gray5">{t('message.writeFirstMessage')}</p>
          </div>
        ) : (
          <div className="px-4 pb-16">
            {messages.map((message) => (
              <Link key={message.id} to={`/message/${message.id}`}>
                <ChatListItem
                  imageUrl={message.guestInfo.profileImageUrl}
                  name={message.guestInfo.firstName}
                  date={'2024-04-28 19:00'}
                  lastMessage={message.lastMessage}
                  placeName={message.title}
                />
              </Link>
            ))}
          </div>
        )}
        {/* <div className="px-4 pb-16">
          <Link to={'/message/123123'}>
            <ChatListItem
              imageUrl="https://picsum.photos/seed/picsum/100/200"
              name="예지나"
              hasSchedule
              date="2024-04-28 19:00"
              lastMessage="그럼 우리 어대역 근처에서 만나면 된다는 말씀이신가요?"
              placeName="서울숲 1티어 맛집"
            />
          </Link>
          <ChatListItem
            imageUrl="https://picsum.photos/seed/picsum/100/200"
            name="예지나"
            hasSchedule
            date="2024-04-28 19:00"
            lastMessage="그럼 우리 어대역 근처에서 만나면 된다는 말씀이신가요?"
            placeName="서울숲 1티어 맛집"
          />
          <ChatListItem
            imageUrl="https://picsum.photos/seed/picsum/100/200"
            name="예지나"
            hasSchedule
            date="2024-04-28 19:00"
            lastMessage="그럼 우리 어대역 근처에서 만나면 된다는 말씀이신가요?"
            placeName="서울숲 1티어 맛집"
          />
          <ChatListItem
            imageUrl="https://picsum.photos/seed/picsum/100/200"
            name="예지나"
            hasSchedule
            date="2024-04-28 19:00"
            lastMessage="그럼 우리 어대역 근처에서 만나면 된다는 말씀이신가요?"
            placeName="서울숲 1티어 맛집"
          />
          <ChatListItem
            imageUrl="https://picsum.photos/seed/picsum/100/200"
            name="예지나"
            hasSchedule
            date="2024-04-28 19:00"
            lastMessage="그럼 우리 어대역 근처에서 만나면 된다는 말씀이신가요?"
            placeName="서울숲 1티어 맛집"
          />
          <ChatListItem
            imageUrl="https://picsum.photos/seed/picsum/100/200"
            name="예지나"
            hasSchedule
            date="2024-04-28 19:00"
            lastMessage="그럼 우리 어대역 근처에서 만나면 된다는 말씀이신가요?"
            placeName="서울숲 1티어 맛집"
          />
          <ChatListItem
            imageUrl="https://picsum.photos/seed/picsum/100/200"
            name="예지나"
            hasSchedule
            date="2024-04-28 19:00"
            lastMessage="그럼 우리 어대역 근처에서 만나면 된다는 말씀이신가요?"
            placeName="서울숲 1티어 맛집"
          />
          <ChatListItem
            imageUrl="https://picsum.photos/seed/picsum/100/200"
            name="예지나"
            hasSchedule
            date="2024-04-28 19:00"
            lastMessage="그럼 우리 어대역 근처에서 만나면 된다는 말씀이신가요?"
            placeName="서울숲 1티어 맛집"
          />
          <ChatListItem
            imageUrl="https://picsum.photos/seed/picsum/100/200"
            name="예지나"
            hasSchedule
            date="2024-04-28 19:00"
            lastMessage="그럼 우리 어대역 근처에서 만나면 된다는 말씀이신가요?"
            placeName="서울숲 1티어 맛집"
          />
        </div> */}
      </IonContent>
    </IonPage>
  );
};

type ChatListItemProps = {
  imageUrl: string;
  name: string;
  lastMessage: string;
  placeName: string;
  date?: string;
  hasSchedule?: boolean;
};
const ChatListItem = ({
  imageUrl,
  name,
  lastMessage,
  placeName,
  date,
  hasSchedule = false,
}: ChatListItemProps) => {
  return (
    <div className="flex items-center gap-4 py-4 border-b border-b-gray1.5">
      <IonImg
        src={imageUrl}
        alt="user profile"
        className="w-[3.25rem] h-[3.25rem] object-cover rounded-full overflow-hidden shrink-0"
      />

      <div className="flex flex-col gap-0.5">
        <div className="flex gap-1.5 items-center">
          <p className="font-body1 text-gray7">{name}</p>
          {hasSchedule && <p className="font-caption2 text-orange6">약속 · {date}</p>}
        </div>
        <p className="w-[16.25rem] overflow-hidden font-body2 text-gray8 text-ellipsis whitespace-nowrap">
          {lastMessage}
        </p>
        <p className="font-caption2 text-gray5.5">{placeName}</p>
      </div>
    </div>
  );
};

export default MessageTab;
