import { IonContent, IonHeader, IonPage, IonText, IonTitle, IonToolbar } from '@ionic/react';
import { Link } from 'react-router-dom';

import useRegionStore from '../stores/user';

const ProfileTab = () => {
  const reset = useRegionStore((state) => state.resetRegion);

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Profile</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <Link to="/login/region">
          <IonText>goto login</IonText>
        </Link>

        <button
          className="button-primary button-md"
          onClick={() => {
            console.log('reset');
            reset();
          }}
        >
          reset region
        </button>
      </IonContent>
    </IonPage>
  );
};

export default ProfileTab;
