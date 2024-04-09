import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, useIonRouter } from '@ionic/react';
import { useEffect, useRef } from 'react';

import Alert from '../components/alerts';

const BookmarkTab = () => {
  const router = useIonRouter();

  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    buttonRef.current?.click();
  }, []);

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Bookmark</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">관심 목록</IonTitle>
          </IonToolbar>
        </IonHeader>
      </IonContent>

      <button id="ready-alert" ref={buttonRef} className="hidden" />

      <Alert
        trigger="ready-alert"
        title="준비중인 기능이에요."
        buttons={[
          { text: '홈으로 돌아가기', onClick: () => router.push('/', 'forward', 'replace') },
        ]}
      />
    </IonPage>
  );
};

export default BookmarkTab;
