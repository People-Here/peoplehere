import {
  IonButtons,
  IonContent,
  IonIcon,
  IonPage,
  IonToolbar,
  useIonRouter,
  useIonViewDidEnter,
} from '@ionic/react';
import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useLayoutEffect, useState } from 'react';
import { Device } from '@capacitor/device';
import { Preferences } from '@capacitor/preferences';

import ArrowLeftIcon from '../../assets/svgs/arrow-left.svg';
import GrayLogoIcon from '../../assets/svgs/logo-gray.svg';
import MessageIcon from '../../assets/svgs/message.svg';
import Footer from '../../layouts/Footer';
import SendMessage from '../../modals/SendMessage';
import useUserStore from '../../stores/user';
import { getMessages, translateMessage } from '../../api/message';
import { getNewToken } from '../../api/login';
import { getTranslateLanguage } from '../../utils/translate';
import LogoRunning from '../../components/LogoRunning';
import { formatDateTimeToString } from '../../utils/date';
import { findKoreanLanguageName } from '../../utils/find';
import LoadingGIF from '../../assets/images/three-dot-loading.gif';
import { capitalizeFirstLetter } from '../../utils/mask';

import type { DeviceInfo } from '@capacitor/device';
import type { Message } from '../../api/message';

const MessageRoom = () => {
  const { t, i18n } = useTranslation();

  const router = useIonRouter();
  const location = useLocation();

  const user = useUserStore((state) => state.user);

  const [messages, setMessages] = useState<Message>();
  const [userInfo, setUserInfo] = useState<Message['guestInfo']>();
  const [isLoading, setIsLoading] = useState(true);

  const [platform, setPlatform] = useState<DeviceInfo['platform']>('web');
  const [currentLang, setCurrentLang] = useState('ko');

  useLayoutEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    (async () => {
      const platformInfo = await Device.getInfo();
      setPlatform(platformInfo.platform);

      const lang = await Preferences.get({ key: 'language' });
      setCurrentLang(lang.value ?? 'en');

      await getMessageList();
    })();
  }, []);

  useIonViewDidEnter(() => {
    // eslint-disable-next-line no-undef
    const content = document.querySelector('ion-content');
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    content?.scrollToBottom();
  });

  const getMessageList = async () => {
    const tourId = location.pathname.split('/').at(-1);

    if (!tourId) return;

    const lang = await getTranslateLanguage();

    setIsLoading(true);

    try {
      const response = await getMessages(tourId, lang);
      setMessages(response.data);

      setUserInfo(
        response.data.guestInfo.id.toString() === user.id
          ? response.data.ownerInfo
          : response.data.guestInfo,
      );
    } catch (error) {
      await getNewToken();

      const response = await getMessages(tourId, lang);
      setMessages(response.data);

      setUserInfo(
        response.data.guestInfo.id.toString() === user.id
          ? response.data.ownerInfo
          : response.data.guestInfo,
      );

      console.error('fail to get messages', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!messages || !userInfo) return <LogoRunning />;

  return (
    <IonPage>
      <IonContent>
        {/* header */}
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
          <IonButtons slot="start">
            <IonIcon src={ArrowLeftIcon} className="svg-lg" onClick={() => router.goBack()} />
          </IonButtons>
          <p className="pl-1.5 font-headline3 text-gray8">{userInfo.firstName}</p>

          <IonButtons slot="end">
            <span
              className="flex items-center justify-center border border-gray3 rounded-md font-body2 text-gray6 w-[4.5rem] h-7"
              onClick={getMessageList}
            >
              {isLoading ? (
                <img src={LoadingGIF} alt="loading" width={24} height={24} />
              ) : (
                t('common.refresh')
              )}
            </span>
          </IonButtons>
        </IonToolbar>

        <ChatInfo
          imageUrl={userInfo.profileImageUrl}
          languages={
            i18n.resolvedLanguage === 'ko'
              ? userInfo.languages.map((lang) => findKoreanLanguageName(lang))
              : userInfo.languages.map((lang) => capitalizeFirstLetter(lang))
          }
          title={messages.title}
          tourId={messages.tourId.toString()}
          userId={userInfo.id.toString()}
        />

        <div className="px-4 pb-24">
          {messages.messageInfoList.length === 0 ? (
            <NoChatChip userName={userInfo.firstName} />
          ) : (
            <div className="flex flex-col gap-8 mt-4">
              {messages.messageInfoList.map((message) => (
                <Chat
                  key={message.messageId}
                  type={
                    message.receiverId.toString() === userInfo.id.toString() ? 'send' : 'receive'
                  }
                  message={message.message}
                  time={formatDateTimeToString(String(message.createdAt))}
                  currentLang={currentLang}
                />
              ))}
            </div>
          )}
        </div>

        <Footer>
          <div className="flex items-center gap-3">
            <button
              id="send-message-modal"
              className="flex gap-2.5 items-center button-primary button-lg w-full justify-center"
            >
              <IonIcon src={MessageIcon} className="svg-lg" />
              <p className="text-white font-subheading1">쪽지 작성</p>
            </button>
          </div>
        </Footer>
        <SendMessage
          trigger="send-message-modal"
          tourId={messages.tourId.toString()}
          receiverId={userInfo.id.toString()}
          onWillDismiss={getMessageList}
        />
      </IonContent>
    </IonPage>
  );
};

type ChatInfoProps = {
  imageUrl: string;
  languages: string[];
  title: string;
  tourId: string;
  userId: string;
};
const ChatInfo = ({ imageUrl, languages, title, tourId, userId }: ChatInfoProps) => {
  return (
    <div className="flex items-center gap-4 p-4 pt-2 bg-white border-b border-gray1.5 mt-16">
      <Link to={`/detail-profile/${userId}`}>
        <img
          src={imageUrl}
          alt="chat user profile"
          className="object-cover overflow-hidden rounded-full w-11 h-11 border-[0.5px] border-gray2"
        />
      </Link>

      <div>
        <div className="flex items-center">
          <p className="font-body1 text-gray6">구사 언어</p>
          <Divider />
          <p className="font-body1 text-gray6">{languages.join(', ')}</p>
        </div>

        <Link to={`/tour/${tourId}`}>
          <p className="underline font-body1 text-gray5">{title}</p>
        </Link>
      </div>
    </div>
  );
};

const NoChatChip = ({ userName }: { userName: string }) => {
  return (
    <div className="flex items-center justify-center w-full gap-2 py-4 bg-gray1 rounded-[100px] mt-5">
      <IonIcon src={GrayLogoIcon} className="svg-md" />
      <p className="font-caption1 text-gray7">
        {userName} 님에게 쪽지를 보내고 약속을 잡아 보세요.
      </p>
    </div>
  );
};

type ChatProps = {
  type: 'send' | 'receive';
  message: string;
  time: string;
  currentLang: string;
};
const Chat = ({ type, message, time, currentLang }: ChatProps) => {
  const [messageLang, setMessageLang] = useState(currentLang);

  const onClickTranslate = async () => {
    const translateTo = messageLang === 'en' ? 'KO' : 'EN';

    try {
      const response = await translateMessage(message, translateTo);
      setMessageLang(response.data.language);
      message = response.data.content;
    } catch (error) {
      console.error('fail to translate message', error);
    }
  };

  return (
    <div className={type === 'receive' ? 'w-full' : 'flex w-full justify-end'}>
      <div className="flex flex-col gap-0.5 w-fit">
        {type === 'receive' ? (
          <p className="font-caption1 text-orange6">받은 쪽지</p>
        ) : (
          <p className="text-right font-caption1 text-gray5">보낸 쪽지</p>
        )}

        <div className="px-2.5 py-2 bg-gray1.5 rounded-md whitespace-pre-wrap max-w-[16.5rem]">
          <p className="font-subheading2 text-gray8">{message}</p>
        </div>

        <div className="flex items-center justify-between">
          <p
            className={
              type === 'receive'
                ? 'font-caption2 text-gray5.5 w-full'
                : 'font-caption2 text-gray5.5 w-full text-right'
            }
          >
            {time}
          </p>
          {/* <IonIcon src={LanguageIcon} className="svg-md" onClick={onClickTranslate} /> */}
        </div>
      </div>
    </div>
  );
};

const Divider = () => {
  return <div className="w-[2px] bg-gray4 h-[14px] mx-2 rounded-full" />;
};

export default MessageRoom;
