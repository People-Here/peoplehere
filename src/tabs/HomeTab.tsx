import { IonContent, IonPage, useIonRouter } from '@ionic/react';
import { useEffect } from 'react';

import Home from '../pages/home/Home';
import useUserStore from '../stores/userInfo';

const HomeTab = () => {
  const router = useIonRouter();
  const region = useUserStore((state) => state.region);

  useEffect(() => {
    if (!region.countryCode) {
      router.push('/region');
    }
  }, []);

  return (
    <IonPage>
      <IonContent fullscreen>
        <Home />
      </IonContent>
    </IonPage>
  );
};

export default HomeTab;
