import { IonContent, IonIcon, IonImg, IonLabel, IonPage, IonText } from '@ionic/react';
import { useState } from 'react';
import { Camera, CameraResultType } from '@capacitor/camera';

import Header from '../../components/Header';
import PlusCircleOrange from '../../assets/svgs/plus-circle-orange.svg';
import GlobeIcon from '../../assets/svgs/globe.svg';
import LanguageIcon from '../../assets/svgs/language.svg';
import DoubleHeartIcon from '../../assets/svgs/double-heart.svg';
import ClockIcon from '../../assets/svgs/clock.svg';
import DogIcon from '../../assets/svgs/dog.svg';
import CakeIcon from '../../assets/svgs/cake.svg';
import LocationIcon from '../../assets/svgs/location.svg';
import BagIcon from '../../assets/svgs/bag.svg';
import SchoolIcon from '../../assets/svgs/school.svg';
import Footer from '../../layouts/Footer';
import Introduce from '../../modals/Introduce';
import SelectRegion from '../../modals/SelectRegion';
import useUserStore from '../../stores/userInfo';

const Profile = () => {
  const { region } = useUserStore((state) => state);

  const [introduce, setIntroduce] = useState('');

  const listItems = [
    {
      iconSrc: GlobeIcon,
      title: '출신국가',
      value: region.koreanName,
      modalId: 'region-modal',
      required: true,
    },
    { iconSrc: LanguageIcon, title: '구사언어', modalId: 'language-modal', required: true },
    { iconSrc: DoubleHeartIcon, title: '좋아하는 것', modalId: 'favorite-modal', required: false },
    { iconSrc: ClockIcon, title: '취미', modalId: 'hobby-modal', required: false },
    { iconSrc: DogIcon, title: '반려동물', modalId: 'pet-modal', required: false },
    { iconSrc: CakeIcon, title: '나이', required: false },
    { iconSrc: LocationIcon, title: '거주지', required: false },
    { iconSrc: BagIcon, title: '직업', required: false },
    { iconSrc: SchoolIcon, title: '출신학교', required: false },
  ];

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
        <div className="px-4 pb-28 mt-7">
          <div className="flex items-center justify-between mb-4">
            <IonText className="font-headline2 text-gray7">자기 소개</IonText>
            <RequiredChip />
          </div>

          <div id="introduce-modal" className="p-4 bg-gray1.5 rounded-xl mb-4">
            <IonText className="whitespace-pre-wrap font-body1 text-gray8">
              {introduce ? introduce : '나에 대한 자유로운 소개글을 작성해 보세요.'}
            </IonText>
          </div>

          <div role="list">
            {listItems.map((item) => (
              <ListItem
                key={item.title}
                id={item.modalId}
                iconSrc={item.iconSrc}
                title={item.title}
                value={item.value}
                required={item.required}
              />
            ))}
          </div>
        </div>

        <Footer>
          <button className="w-full button-primary button-lg">완료</button>
        </Footer>
      </IonContent>

      {/* modals */}
      <Introduce trigger="introduce-modal" setIntroduce={setIntroduce} />
      <SelectRegion trigger="region-modal" />
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
  const [selectedImage, setSelectedImage] = useState('');

  const selectPhoto = async () => {
    const selectedImage = await Camera.getPhoto({
      quality: 70,
      allowEditing: true,
      resultType: CameraResultType.Uri,
      promptLabelHeader: '프로필 사진 추가',
      promptLabelPicture: '사진 촬영하기',
      promptLabelPhoto: '앨범에서 사진 선택하기',
      promptLabelCancel: '취소',
    });

    setSelectedImage(selectedImage.webPath ?? '');
  };

  return (
    <div className="bg-gray1 w-full h-[20.5rem] flex items-center justify-center relative">
      {selectedImage ? (
        <IonImg src={selectedImage} className="object-cover w-full h-full" />
      ) : (
        <>
          <div className="absolute top-4 right-4">
            <RequiredChip />
          </div>

          <div className="flex flex-col items-center gap-3" onClick={selectPhoto}>
            <IonIcon icon={PlusCircleOrange} className="w-9 h-9" />
            <IonText className="font-subheading2 text-gray5.5">프로필 사진을 추가하세요</IonText>
          </div>
        </>
      )}
    </div>
  );
};

type ListItemProps = {
  iconSrc: string;
  title: string;
  id?: string;
  value?: string;
  required?: boolean;
};
const ListItem = ({ iconSrc, title, id, value, required }: ListItemProps) => {
  return (
    <div className="flex items-center justify-between py-4 border-b border-gray1.5" id={id}>
      <div className="flex items-center gap-4">
        <IonIcon icon={iconSrc} className="svg-lg" />
        <IonLabel className="font-body1 text-gray8">
          {title}
          {value && `: ${value}`}
        </IonLabel>
      </div>

      {required && <RequiredChip />}
    </div>
  );
};

export default Profile;
