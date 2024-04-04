import { IonContent, IonPage } from '@ionic/react';

import PostPlace from '../pages/post/PostPlace';

const PostTab = () => {
  return (
    <IonPage>
      <IonContent>
        <PostPlace />
      </IonContent>
    </IonPage>
  );
};

export default PostTab;
