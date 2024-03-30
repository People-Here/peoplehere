import { IonContent, IonHeader, IonPage, IonText, IonTitle, IonToolbar } from '@ionic/react';
import { Link } from 'react-router-dom';

const ProfileTab = () => {
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
      </IonContent>
    </IonPage>
  );
};

export default ProfileTab;
