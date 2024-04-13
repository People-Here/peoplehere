import { IonContent, IonPage, useIonRouter } from '@ionic/react';
import { useEffect } from 'react';

import useUserStore from '../stores/userInfo';
import useStorage from '../hooks/useStorage';

const ProfileTab = () => {
  const reset = useUserStore((state) => state.resetRegion);

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
        <button className="button-primary button-md" onClick={() => reset()}>
          reset region
        </button>
      </IonContent>
    </IonPage>
  );
};

export default ProfileTab;
