import { IonContent, IonPage } from '@ionic/react';
import { useLayoutEffect } from 'react';

import PostPlace from '../pages/post/PostPlace';
import useLogin from '../hooks/useLogin';

const PostTab = () => {
  const { checkLogin } = useLogin();

  useLayoutEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    checkLogin();
  }, [checkLogin]);

  return (
    <IonPage>
      <IonContent>
        <PostPlace />
      </IonContent>
    </IonPage>
  );
};

export default PostTab;
