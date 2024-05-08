import { IonContent, IonIcon, IonPage, useIonRouter } from '@ionic/react';
import { useLayoutEffect, useState } from 'react';

import Header from '../../components/Header';
import PencilWithCircleIcon from '../../assets/svgs/pencil-with-circle.svg';
import useUserStore from '../../stores/user';
import { getUserProfile } from '../../api/profile';
import useSignInStore from '../../stores/signIn';
import LogoRunning from '../../components/LogoRunning';

import type { ProfileResponse } from '../../api/profile';

const Informations = () => {
  const router = useIonRouter();

  const user = useUserStore((state) => state.user);
  const { region, email } = useSignInStore((state) => state);

  const [userInfo, setUserInfo] = useState<ProfileResponse>();

  useLayoutEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    (async () => {
      const response = await getUserProfile(user.id, region.countryCode.toUpperCase());

      if (response.status === 200) {
        setUserInfo(response.data);
      }
    })();
  }, [user.id, region.countryCode]);

  if (!userInfo) {
    return <LogoRunning />;
  }

  return (
    <IonPage>
      <IonContent fullscreen>
        <Header type="back" title="개인정보" />

        <div className="px-4">
          <div className="flex items-center justify-between w-full py-4 border-b border-gray1.5">
            <div>
              <p className="mb-1 font-subheading2 text-gray7">이름</p>
              <p className="font-body2 text-gray6">
                {userInfo.firstName} {userInfo.lastName}
              </p>
            </div>

            <IonIcon
              icon={PencilWithCircleIcon}
              className="svg-lg"
              onClick={() => router.push('/settings/informations/name')}
            />
          </div>

          <div className="flex items-center justify-between w-full py-4 border-b border-gray1.5">
            <div>
              <p className="mb-1 font-subheading2 text-gray7">이메일</p>
              <p className="font-body2 text-gray6">{email}</p>
            </div>

            <IonIcon
              icon={PencilWithCircleIcon}
              className="svg-lg"
              onClick={() => router.push('/settings/informations/email')}
            />
          </div>

          {/* <div className="flex items-center justify-between w-full py-4 border-b border-gray1.5">
            <div>
              <p className="mb-1 font-subheading2 text-gray7">전화번호</p>
              <p className="font-body2 text-gray6">안전한 만남을 위해 본인인증을 완료해 주세요.</p>
            </div>

            <IonIcon icon={PencilWithCircleIcon} className="svg-lg" />
          </div> */}
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Informations;
