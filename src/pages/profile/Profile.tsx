import { IonContent, IonIcon, IonPage, IonText } from '@ionic/react';

import Header from '../../components/Header';
import PlusCircleOrange from '../../assets/svgs/plus-circle-orange.svg';

const Profile = () => {
  return (
    <IonPage>
      <IonContent fullscreen>
        <Header type="close" title="Rachel" />

        {/* title area */}
        <div className="px-4 mt-2 mb-4">
          <div className="border border-gray3 rounded-2xl flex items-center py-2 flex-col gap-1.5">
            <IonText className="text-center whitespace-pre-wrap font-body1 text-gray6">
              {'피플히어의 다른 회원들에게\n나를 소개하는 프로필을 만들어 주세요.'}
            </IonText>
            <IonText className="font-caption1 text-gray5">
              한글로 작성할 경우 자동으로 영문 번역될 수 있어요.
            </IonText>
          </div>
        </div>

        {/* image area */}
        <ImageArea />

        {/* content area */}
        <div className="px-4 mt-7">
          <div className="flex items-center justify-between">
            <IonText className="font-headline2 text-gray7">자기 소개</IonText>
            <RequiredChip />
          </div>
        </div>
      </IonContent>
    </IonPage>
  );
};

const RequiredChip = () => {
  return (
    <span className="px-2 py-0.5 border border-orange2 bg-orange1 rounded-full font-caption1 text-orange5">
      필수
    </span>
  );
};

const ImageArea = () => {
  return (
    <div className="bg-gray1 w-full h-[20.5rem] flex items-center justify-center relative">
      <div className="absolute top-4 right-4">
        <RequiredChip />
      </div>

      <div className="flex flex-col items-center gap-3">
        <IonIcon icon={PlusCircleOrange} className="w-9 h-9" />
        <IonText className="font-subheading2 text-gray5.5">프로필 사진을 추가하세요</IonText>
      </div>
    </div>
  );
};

type ListItemProps = {
  iconSrc: string;
};
const ListItem = () => {};

export default Profile;
