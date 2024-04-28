import {
  IonButtons,
  IonContent,
  IonIcon,
  IonImg,
  IonPage,
  IonTitle,
  IonToolbar,
  useIonRouter,
} from '@ionic/react';
import { Link } from 'react-router-dom';
import { useRef } from 'react';

import ArrowLeftIcon from '../../assets/svgs/arrow-left.svg';
import GrayLogoIcon from '../../assets/svgs/logo-gray.svg';
import MessageIcon from '../../assets/svgs/message.svg';
import Footer from '../../layouts/Footer';
import Alert from '../../components/Alert';
import SendMessage from '../../modals/SendMessage';

const messages = [];

const MessageRoom = () => {
  const router = useIonRouter();

  const buttonRef = useRef<HTMLButtonElement>(null);

  const makeAppointment = () => {
    if (messages.length === 0) {
      buttonRef.current?.click();
    }
  };

  return (
    <IonPage>
      {/* header */}
      <IonToolbar className="px-4 h-14">
        <IonButtons slot="start">
          <IonIcon src={ArrowLeftIcon} className="svg-lg" onClick={() => router.goBack()} />
        </IonButtons>

        <IonTitle className="pl-1.5 font-headline3 text-gray8">Rachel</IonTitle>

        <IonButtons slot="end">
          <span className="flex py-[3px] px-3 border border-gray3 rounded-md font-body2 text-gray6 w-fit">
            새로고침
          </span>
        </IonButtons>
      </IonToolbar>

      <IonContent>
        <ChatInfo
          imageUrl="https://picsum.photos/seed/picsum/100/200"
          languages={['한국어', '영어']}
          title="홍대 소품샵 둘러보기"
          tourId="13132323"
        />

        <div className="px-4">
          <NoChatChip userName="예지나" />
        </div>
      </IonContent>

      <Footer>
        <div className="flex items-center gap-3">
          <button
            className="px-5 button-line button-lg whitespace-nowrap font-subheading1 text-gray6"
            onClick={makeAppointment}
          >
            약속 잡기
          </button>
          <button
            id="send-message-modal"
            className="flex gap-2.5 items-center button-primary button-lg w-full justify-center"
          >
            <IonIcon src={MessageIcon} className="svg-lg" />
            <p className="text-white font-subheading1">쪽지 작성</p>
          </button>
        </div>
      </Footer>

      <button ref={buttonRef} id="no-message-alert" className="hidden" />
      <Alert
        trigger="no-message-alert"
        title={'아직 쪽지를 보내지 않아서\n약속을 잡을 수 없어요.'}
        buttons={[
          {
            text: '확인',
          },
        ]}
      />

      <SendMessage trigger="send-message-modal" sendMessage={() => {}} />
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

const Divider = () => {
  return <div className="w-[2px] bg-gray4 h-[14px] mx-2 rounded-full" />;
};

export default MessageRoom;
