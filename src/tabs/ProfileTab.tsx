import { IonContent, IonPage } from '@ionic/react';

import useUserStore from '../stores/userInfo';

const ProfileTab = () => {
  const reset = useUserStore((state) => state.resetRegion);

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
