import { IonContent, IonIcon, IonPage, useIonRouter } from '@ionic/react';

import Header from '../../components/Header';
import PencilWithCircleIcon from '../../assets/svgs/pencil-with-circle.svg';
import useUserStore from '../../stores/user';
import useSignInStore from '../../stores/signIn';

const Informations = () => {
  const router = useIonRouter();

  const user = useUserStore((state) => state.user);
  const { email } = useSignInStore((state) => state);

  return (
    <IonPage>
      <IonContent fullscreen>
        <Header type="back" title="개인정보" />

        <div className="px-4">
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
