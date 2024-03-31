import { IonContent, IonPage } from '@ionic/react';

import Home from '../pages/home/Home';

const HomeTab = () => {
  return (
    <IonPage>
      <IonContent fullscreen>
        <Home />
      </IonContent>
    </IonPage>
  );
};

export default HomeTab;
