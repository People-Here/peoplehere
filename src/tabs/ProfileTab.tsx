import { IonContent, IonPage, useIonRouter } from '@ionic/react';
import { useEffect } from 'react';
import { Preferences } from '@capacitor/preferences';

import useUserStore from '../stores/user';
import MyPage from '../pages/my-page/MyPage';

const ProfileTab = () => {
  const router = useIonRouter();

  const { user } = useUserStore((state) => state);

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    (async () => {
      const token = await Preferences.get({ key: 'accessToken' });

      if (!token || !user.id) {
        router.push('/login', 'forward', 'replace');
        return;
      }
    })();
  }, [user.id, router]);

  return (
    <IonPage>
      <IonContent fullscreen>
        <MyPage />
      </IonContent>
    </IonPage>
  );
};

export default ProfileTab;
