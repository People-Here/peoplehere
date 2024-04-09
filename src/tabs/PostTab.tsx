import { IonContent, IonPage, useIonRouter } from '@ionic/react';
import { useEffect } from 'react';

import PostPlace from '../pages/post/PostPlace';
import useStorage from '../hooks/useStorage';

const PostTab = () => {
  const router = useIonRouter();

  const { getItem } = useStorage();

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    (async () => {
      const token = await getItem('token');

      if (!token) {
        router.push('/login');
      }
    })();
  }, []);

  return (
    <IonPage>
      <IonContent>
        <PostPlace />
      </IonContent>
    </IonPage>
  );
};

export default PostTab;
