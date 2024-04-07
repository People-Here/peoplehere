import { IonContent, IonPage, IonText } from '@ionic/react';
import { Link } from 'react-router-dom';

import useUserStore from '../stores/userInfo';

const ProfileTab = () => {
  const reset = useUserStore((state) => state.resetRegion);

  return (
    <IonPage>
      <IonContent>
        <Link to="/login/region">
          <IonText>goto login</IonText>
        </Link>

        <Link to="/login">
          <IonText>goto login</IonText>
        </Link>

        <button className="button-primary button-md" onClick={() => reset()}>
          reset region
        </button>
      </IonContent>
    </IonPage>
  );
};

export default ProfileTab;
