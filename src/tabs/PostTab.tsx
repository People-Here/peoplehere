import { IonContent, IonPage, useIonRouter } from '@ionic/react';
import { useEffect, useRef } from 'react';
import { Preferences } from '@capacitor/preferences';

import PostPlace from '../pages/post/PostPlace';
import Alert from '../components/Alert';

const PostTab = () => {
  const router = useIonRouter();

  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    (async () => {
      const token = await Preferences.get({ key: 'accessToken' });

      if (!token) {
        router.push('/login', 'forward', 'replace');
        return;
      }

      buttonRef.current?.click();
    })();
  }, []);

  return (
    <IonPage>
      <IonContent>
        <PostPlace />
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

export default PostTab;
