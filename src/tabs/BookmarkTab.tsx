import { IonContent, IonPage, useIonRouter } from '@ionic/react';
import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';

import Alert from '../components/Alert';

const BookmarkTab = () => {
  const router = useIonRouter();

  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    buttonRef.current?.click();
  }, []);

  return (
    <IonPage>
      <IonContent fullscreen>
        <Link to={'/login'}>
          <button>go to login</button>
        </Link>
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
