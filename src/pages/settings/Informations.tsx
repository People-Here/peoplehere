import { IonContent, IonIcon, IonPage, useIonRouter } from '@ionic/react';

import Header from '../../components/Header';
import PencilWithCircleIcon from '../../assets/svgs/pencil-with-circle.svg';
import useUserStore from '../../stores/user';
import useSignInStore from '../../stores/signIn';
import { maskPhoneNumber } from '../../utils/mask';

const Informations = () => {
  const router = useIonRouter();

  const user = useUserStore((state) => state.user);
  const region = useSignInStore((state) => state.region);

  return (
    <IonPage>
      <IonContent fullscreen>
        <Header type="back" title="개인정보" fixed />

        <div className="px-4 mt-14">
          <div className="flex items-center justify-between w-full py-4 border-b border-gray1.5">
            <div>
              <p className="mb-1 font-subheading2 text-gray7">이름</p>
              <p className="font-body2 text-gray6">
                {user.firstName} {user.lastName}
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
              <p className="font-body2 text-gray6">{user.email}</p>
            </div>

            <IonIcon
              icon={PencilWithCircleIcon}
              className="svg-lg"
              onClick={() => router.push('/settings/informations/email')}
            />
          </div>

          <div className="flex items-center justify-between w-full py-4 border-b border-gray1.5">
            <div>
              <p className="mb-1 font-subheading2 text-gray7">전화번호</p>
              {user.phoneNumber ? (
                <p className="font-body2 text-gray6">
                  {region.dialCode} {maskPhoneNumber(user.phoneNumber)}
                </p>
              ) : (
                <p className="font-body1 text-orange6">
                  안전한 만남을 위해 본인인증을 완료해 주세요.
                </p>
              )}
            </div>

            <IonIcon
              icon={PencilWithCircleIcon}
              className="svg-lg"
              onClick={() => router.push('/settings/informations/phone')}
            />
          </div>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Informations;
