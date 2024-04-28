import { IonContent, IonPage, IonTitle, IonToolbar } from '@ionic/react';

const MessageTab = () => {
  return (
    <IonPage>
      <IonToolbar className="px-4 h-14">
        <IonTitle className="pl-0 font-headline3 text-gray8">쪽지</IonTitle>
      </IonToolbar>

      <IonContent fullscreen>
        <div className="flex flex-col gap-1.5 items-center justify-center w-full h-full text-center">
          <p className="text-black font-headline2">아직 주고 받은 쪽지가 없어요</p>
          <p className="font-body1 text-gray5">만나고 싶은 사람에게 쪽지를 보내 보세요!</p>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default MessageTab;
