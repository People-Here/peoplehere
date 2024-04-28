import { IonContent, IonImg, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import { Link } from 'react-router-dom';

const MessageTab = () => {
  return (
    <IonPage>
      <IonToolbar className="px-4 bg-white h-14">
        <IonTitle className="pl-0 font-headline3 text-gray8">쪽지</IonTitle>
      </IonToolbar>

      <IonContent fullscreen>
        {/* <div className="flex flex-col gap-1.5 items-center justify-center w-full h-full text-center">
          <p className="text-black font-headline2">아직 주고 받은 쪽지가 없어요</p>
          <p className="font-body1 text-gray5">만나고 싶은 사람에게 쪽지를 보내 보세요!</p>
        </div> */}
        <div className="px-4 pb-16 mt-14">
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
        </div>
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
