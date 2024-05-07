import { IonContent, IonPage, useIonRouter } from '@ionic/react';
import { useLayoutEffect } from 'react';

import PostPlace from '../pages/post/PostPlace';
import useLogin from '../hooks/useLogin';
import useUserStore from '../stores/user';
import { getUserProfile } from '../api/profile';
import useSignInStore from '../stores/signIn';

const PostTab = () => {
  const router = useIonRouter();
  const { checkLogin } = useLogin();

  const user = useUserStore((state) => state.user);
  const region = useSignInStore((state) => state.region);

  useLayoutEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    (async () => {
      const isLoggedIn = await checkLogin();
      if (!isLoggedIn) {
        return;
      }

      const profileInfo = await getUserProfile(user.id, region.countryCode.toUpperCase());

      if (
        !profileInfo.data.introduce ||
        !profileInfo.data.profileImageUrl ||
        !profileInfo.data.languages.length
      ) {
        router.push('/edit-profile');
      }
    })();
  }, [checkLogin, router, user.id, region.countryCode]);

  return (
    <IonPage>
      <IonContent>
        <PostPlace />
      </IonContent>
    </IonPage>
  );
};

export default PostTab;
