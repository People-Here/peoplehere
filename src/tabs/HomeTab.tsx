import { IonContent, IonPage, useIonRouter } from '@ionic/react';
import { useEffect } from 'react';

import Home from '../pages/home/Home';
import useSignInStore from '../stores/signIn';
import useUserStore from '../stores/user';
import useLogin from '../hooks/useLogin';

const HomeTab = () => {
  const router = useIonRouter();
  const region = useSignInStore((state) => state.region);
  const user = useUserStore((state) => state.user);
  const { isLoggedIn } = useLogin();

  useEffect(() => {
    if (!region.countryCode) {
      router.push('/region');
      return;
    }

    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    (async () => {
      const token = await isLoggedIn();

      if (token && !user.firstName) {
        router.push('/profile/edit');
      }
    })();
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
