import { IonContent, IonPage, useIonRouter } from '@ionic/react';
import { useEffect } from 'react';
import { Preferences } from '@capacitor/preferences';

import PostPlace from '../pages/post/PostPlace';

const PostTab = () => {
  const router = useIonRouter();

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    (async () => {
      const token = await Preferences.get({ key: 'accessToken' });

      if (!token) {
        router.push('/login', 'forward', 'replace');
        return;
      }
    })();
  }, []);

  return (
    <IonPage>
      <IonContent>
        <PostPlace />
      </IonContent>
    </IonPage>
  );
};

export default PostTab;
