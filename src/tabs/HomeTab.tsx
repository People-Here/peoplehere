import { IonPage, useIonRouter } from '@ionic/react';
import { useEffect } from 'react';

import Home from '../pages/home/Home';
import useSignInStore from '../stores/signIn';

const HomeTab = () => {
  const router = useIonRouter();
  const region = useSignInStore((state) => state.region);

  useEffect(() => {
    if (!region.countryCode) {
      router.push('/region');
      return;
    }
  }, []);

  return (
    <IonPage>
      <Home />
    </IonPage>
  );
};

export default HomeTab;
