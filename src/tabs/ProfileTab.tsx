import { IonContent, IonPage, useIonRouter } from '@ionic/react';
import { useEffect } from 'react';

import useUserStore from '../stores/userInfo';
import useStorage from '../hooks/useStorage';

const ProfileTab = () => {
  const { resetRegion } = useUserStore((state) => state);

  const router = useIonRouter();

  const { getItem } = useStorage();

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    (async () => {
      const token = await getItem('accessToken');

      if (!token) {
        router.push('/login', 'forward', 'replace');
        return;
      }
    })();
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
