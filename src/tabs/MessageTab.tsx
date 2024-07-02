import {
  IonContent,
  IonImg,
  IonPage,
  IonRefresher,
  IonRefresherContent,
  IonToolbar,
  useIonRouter,
} from '@ionic/react';
import { useLayoutEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { Device } from '@capacitor/device';

import useLogin from '../hooks/useLogin';
import { getUserProfile } from '../api/profile';
import useUserStore from '../stores/user';
import useSignInStore from '../stores/signIn';
import { getNewToken } from '../api/login';
import { getMessageRooms } from '../api/message';
import { getTranslateLanguage } from '../utils/translate';

import type { RefresherEventDetail } from '@ionic/react';
import type { DeviceInfo } from '@capacitor/device';
import type { AxiosError } from 'axios';
import type { MessageRoom } from '../api/message';

const MessageTab = () => {
  const { t } = useTranslation();

  const router = useIonRouter();

  const { checkLogin } = useLogin();
  const user = useUserStore((state) => state.user);
  const region = useSignInStore((state) => state.region);

  const [messages, setMessages] = useState<MessageRoom[]>([]);

  const [platform, setPlatform] = useState<DeviceInfo['platform']>('web');

  useLayoutEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    (async () => {
      const isLoggedIn = await checkLogin();
      if (!isLoggedIn) {
        return;
      }

      const platformInfo = await Device.getInfo();
      setPlatform(platformInfo.platform);

      const profileInfo = await getUserProfile(user.id, region.countryCode.toUpperCase());

      if (
        !profileInfo.data.introduce ||
        !profileInfo.data.profileImageUrl ||
        !profileInfo.data.languages.length
      ) {
        router.push('/edit-profile', 'forward', 'replace');
      }
    })();
  }, []);

  useLayoutEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    getAllMessageRooms();
  }, []);

  const getAllMessageRooms = async () => {
    const lang = await getTranslateLanguage();

    try {
      const response = await getMessageRooms(lang);
      setMessages(response.data.tourRoomList);
    } catch (error) {
      const errorInstance = error as AxiosError;

      if (errorInstance.response?.status === 401) {
        await getNewToken();

        const response = await getMessageRooms(lang);
        setMessages(response.data.tourRoomList);
      }
    }
  };

  const handleRefresh = async (event: CustomEvent<RefresherEventDetail>) => {
    await getAllMessageRooms();
    event.detail.complete();
  };

  return (
    <IonPage>
      <IonContent fullscreen>
        <IonToolbar
          slot="fixed"
          className={
            platform === 'web'
              ? 'px-4 bg-white h-14'
              : platform === 'android'
                ? 'px-4 bg-white h-14 flex items-end'
                : 'px-4 bg-white h-24 flex items-end'
          }
        >
          <p className="pl-0 text-gray8 font-headline1">{t('message.title')}</p>
        </IonToolbar>

        <IonRefresher slot="fixed" onIonRefresh={handleRefresh}>
          <IonRefresherContent />
        </IonRefresher>

        {messages.length === 0 ? (
          <div className="flex flex-col gap-1.5 items-center justify-center w-full h-4/5 text-center overflow-hidden mt-16">
            <p className="text-black font-headline2">{t('message.noMessage')}</p>
            <p className="font-body1 text-gray5">{t('message.writeFirstMessage')}</p>
          </div>
        ) : (
          <div className="px-4 pb-16 mt-16">
            {messages.map((message) => (
              <Link key={message.id} to={`/room-message/${message.id}`}>
                {message.guestInfo.id.toString() === user.id ? (
                  <ChatListItem
                    imageUrl={message.ownerInfo.profileImageUrl}
                    name={message.ownerInfo.firstName}
                    date={'2024-04-28 19:00'}
                    lastMessage={message.lastMessage}
                    placeName={message.title}
                    read={message.readFlag}
                  />
                ) : (
                  <ChatListItem
                    imageUrl={message.guestInfo.profileImageUrl}
                    name={message.guestInfo.firstName}
                    date={'2024-04-28 19:00'}
                    lastMessage={message.lastMessage}
                    placeName={message.title}
                    read={message.readFlag}
                  />
                )}
              </Link>
            ))}
          </div>
        )}
      </IonContent>
    </IonPage>
  );
};

type ChatListItemProps = {
  imageUrl: string;
  name: string;
  lastMessage: string;
  placeName: string;
  read: boolean;
  date?: string;
  hasSchedule?: boolean;
};
const ChatListItem = ({
  imageUrl,
  name,
  lastMessage,
  placeName,
  read,
  date,
  hasSchedule = false,
}: ChatListItemProps) => {
  return (
    <div className="flex items-center gap-4 py-4 border-b border-b-gray1.5">
      <IonImg
        src={imageUrl}
        alt="user profile"
        className="w-[3.25rem] h-[3.25rem] object-cover rounded-full overflow-hidden shrink-0 border border-gray1.5"
      />

      <div className="flex flex-col gap-0.5">
        <div className="flex gap-1.5 items-center">
          <p className="font-body1 text-gray7" style={{ fontWeight: read ? 500 : 700 }}>
            {name}
          </p>
          {hasSchedule && <p className="font-caption2 text-orange6">약속 · {date}</p>}
        </div>
        <p
          className="w-[16.25rem] overflow-hidden font-subheading2 text-gray8 text-ellipsis whitespace-nowrap"
          style={{ fontWeight: read ? 500 : 600 }}
        >
          {lastMessage}
        </p>
        <p className="font-caption2 text-gray5.5">{placeName}</p>
      </div>
    </div>
  );
};

export default MessageTab;
