import { IonContent, IonPage, useIonRouter } from '@ionic/react';
import { useEffect, useRef } from 'react';

import useUserStore from '../stores/userInfo';
import Alert from '../components/alerts';

const ProfileTab = () => {
  const reset = useUserStore((state) => state.resetRegion);

  const router = useIonRouter();
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    buttonRef.current?.click();
  }, []);

  return (
    <IonPage>
      <IonContent>
        <button className="button-primary button-md" onClick={() => reset()}>
          reset region
        </button>
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

export default ProfileTab;
