import { IonContent, IonPage, useIonRouter } from '@ionic/react';
import { useEffect } from 'react';
import { Preferences } from '@capacitor/preferences';

import useSignInStore from '../stores/signIn';

const ProfileTab = () => {
  const { resetRegion } = useSignInStore((state) => state);

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

    router.push('/profile/me');
  }, []);

  return (
    <IonPage>
      <IonContent>
        <button className="button-primary button-md" onClick={resetRegion}>
          reset region
        </button>
      </IonContent>
    </IonPage>
  );
};

export default ProfileTab;
