import { IonContent, IonPage } from '@ionic/react';
import { useLayoutEffect } from 'react';

import MyPage from '../pages/my-page/MyPage';
import useLogin from '../hooks/useLogin';

const ProfileTab = () => {
  const { checkLogin } = useLogin();

  useLayoutEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    checkLogin();
  }, [checkLogin]);

  return (
    <IonPage>
      <IonContent fullscreen>
        <MyPage />
      </IonContent>
    </IonPage>
  );
};

export default ProfileTab;
