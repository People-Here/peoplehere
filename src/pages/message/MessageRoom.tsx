import {
  IonButtons,
  IonContent,
  IonIcon,
  IonImg,
  IonPage,
  IonToolbar,
  useIonRouter,
} from '@ionic/react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useLayoutEffect, useState } from 'react';

import ArrowLeftIcon from '../../assets/svgs/arrow-left.svg';
import GrayLogoIcon from '../../assets/svgs/logo-gray.svg';
import MessageIcon from '../../assets/svgs/message.svg';
import Footer from '../../layouts/Footer';
import SendMessage from '../../modals/SendMessage';
import LanguageIcon from '../../assets/svgs/language.svg';
import useUserStore from '../../stores/user';
import { getMessageRooms, type MessageRoom as MessageRoomType } from '../../api/message';
import { getNewToken } from '../../api/login';

import type { AxiosError } from 'axios';

// const messages: Message[] = [
//   {
//     type: 'receive',
//     message: '안녕하세요 ㅎㅎ 혹시 언제 시간 괜찮으세요?',
//     time: '24/01/24 22:46',
//   },
//   {
//     type: 'send',
//     message: '안녕하세요~\n저는 이번주 일요일 3시가 좋아요.\n예지나님은요??',
//     time: '24/01/24 22:48',
//   },
//   {
//     type: 'receive',
//     message: '일요일 3시면 괜찮아요! 어디에서 만나면 될까요?',
//     time: '24/01/24 23:20',
//   },
// ];

const MessageRoom = () => {
  const { t } = useTranslation();

  const router = useIonRouter();

  const user = useUserStore((state) => state.user);

  const [messages, setMessages] = useState<MessageRoomType[]>([]);

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
      <IonContent>
        {/* header */}
        <IonToolbar className="px-4 bg-white h-14">
          <IonButtons slot="start">
            <IonIcon src={ArrowLeftIcon} className="svg-lg" onClick={() => router.goBack()} />
          </IonButtons>
          <p className="pl-1.5 font-headline3 text-gray8">{user.firstName}</p>

          <IonButtons slot="end">
            <span className="flex items-center justify-center border border-gray3 rounded-md font-body2 text-gray6 w-[4.5rem] h-7">
              {t('common.refresh')}
            </span>
          </IonButtons>
        </IonToolbar>

        <ChatInfo
          imageUrl="https://picsum.photos/seed/picsum/100/200"
          languages={['한국어', '영어']}
          title="홍대 소품샵 둘러보기"
          tourId="13132323"
        />

        {/* <div className="px-4">
          {messages.length === 0 ? (
            <NoChatChip userName="예지나" />
          ) : (
            <div className="flex flex-col gap-8 mt-4">
              {messages.map((msg) => (
                <Chat key={msg.lastMessage} {...msg} />
              ))}
            </div>
          )}
        </div> */}

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
        <SendMessage trigger="send-message-modal" tourId="1" receiverId="1" />
      </IonContent>
    </IonPage>
  );
};

type ChatInfoProps = {
  imageUrl: string;
  languages: string[];
  title: string;
  tourId: string;
};
const ChatInfo = ({ imageUrl, languages, title, tourId }: ChatInfoProps) => {
  return (
    <div className="flex items-center gap-4 p-4 bg-white border-b border-gray1.5">
      <IonImg
        src={imageUrl}
        alt="chat user profile"
        className="object-cover overflow-hidden rounded-full w-11 h-11"
      />

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
};
const Chat = ({ type, message, time }: ChatProps) => {
  return (
    <div className={type === 'receive' ? 'w-full' : 'flex w-full justify-end'}>
      <div className="flex flex-col gap-0.5 w-fit">
        {type === 'receive' ? (
          <p className="font-body1 text-orange6">받은 쪽지</p>
        ) : (
          <p className="font-body1 text-gray5">보낸 쪽지</p>
        )}

        <div className="px-2.5 py-2 bg-gray1.5 rounded-md whitespace-pre-wrap max-w-[16.5rem]">
          <p className="font-body1 text-gray8">{message}</p>
        </div>

        <div className="flex items-center justify-between">
          <p className="font-caption2 text-gray5.5">{time}</p>
          <IonIcon src={LanguageIcon} className="svg-md" />
        </div>
      </div>
    </div>
  );
};

const Divider = () => {
  return <div className="w-[2px] bg-gray4 h-[14px] mx-2 rounded-full" />;
};

export default MessageRoom;
