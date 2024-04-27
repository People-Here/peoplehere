import {
  IonContent,
  IonIcon,
  IonImg,
  IonLabel,
  IonPage,
  IonText,
  useIonRouter,
} from '@ionic/react';
import { useLayoutEffect, useState } from 'react';
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
import useSignInStore from '../../stores/signIn';
import SimpleInputModal from '../../modals/SimpleInputModal';
import ShowAge from '../../modals/ShowAge';
import SelectLanguages from '../../modals/SelectLanguages';
import useProfileStore from '../../stores/user';
import { getUserProfile, updateUserProfile } from '../../api/profile';

import type { UpdateProfileRequest } from '../../api/profile';
import type { Language } from '../../modals/SelectLanguages';

const EditProfile = () => {
  const router = useIonRouter();

  const region = useSignInStore((state) => state.region);
  const userId = useProfileStore((state) => state.user.id);

  const [image, setImage] = useState('');
  const [introduce, setIntroduce] = useState('');
  const [languages, setLanguages] = useState<Language[]>([]); // Language type is defined in SelectLanguages.tsx
  const [favorite, setFavorite] = useState('');
  const [hobby, setHobby] = useState('');
  const [pet, setPet] = useState('');
  const [showAge, setShowAge] = useState(false);
  const [location, setLocation] = useState('');
  const [job, setJob] = useState('');
  const [school, setSchool] = useState('');

  useLayoutEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    (async () => {
      const response = await getUserProfile(userId, region.countryCode);

      setImage(response.data.profileImageUrl);
      setIntroduce(response.data.introduce);
      setLanguages(
        response.data.languages.map((lang) => ({ koreanName: lang, englishName: lang, lang })),
      );
      setFavorite(response.data.favorite ?? '');
      setHobby(response.data.hobby ?? '');
      setPet(response.data.pet ?? '');
      setJob(response.data.job ?? '');
      setSchool(response.data.school ?? '');
    })();
  }, []);

  const listItems = [
    {
      iconSrc: GlobeIcon,
      title: '출신국가',
      value: region.koreanName,
      modalId: 'region-modal',
      required: true,
    },
    {
      iconSrc: LanguageIcon,
      title: '구사언어',
      value: languages.map((lang) => lang.koreanName).join(', '),
      modalId: 'language-modal',
      required: true,
    },
    {
      iconSrc: DoubleHeartIcon,
      title: '좋아하는 것',
      value: favorite,
      modalId: 'favorite-modal',
      required: false,
    },
    { iconSrc: ClockIcon, title: '취미', value: hobby, modalId: 'hobby-modal', required: false },
    { iconSrc: DogIcon, title: '반려동물', value: pet, modalId: 'pet-modal', required: false },
    { iconSrc: CakeIcon, title: '나이', value: '90년대생', modalId: 'age-modal', required: false },
    { iconSrc: LocationIcon, title: '거주지', value: location, required: false },
    { iconSrc: BagIcon, title: '직업', value: job, modalId: 'job-modal', required: false },
    {
      iconSrc: SchoolIcon,
      title: '출신학교',
      value: school,
      modalId: 'school-modal',
      required: false,
    },
  ];

  const saveProfile = async () => {
    const requestData: UpdateProfileRequest = {
      id: userId,
      profileImageUrl: image,
      introduce,
      region: region.countryCode,
      languages: languages.map((lang) => lang.englishName.toUpperCase()),
      favorite,
      hobby,
      pet,
      job,
      school,
      placeId: '',
    };

    try {
      await updateUserProfile(requestData);
      router.push('/profile/me', 'forward', 'replace');
    } catch (error) {
      console.error('Failed to update user profile:', error);
    }
  };

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
        <ImageArea image={image} setImage={setImage} />

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
          <button className="w-full button-primary button-lg" onClick={saveProfile}>
            완료
          </button>
        </Footer>
      </IonContent>

      {/* modals */}
      <Introduce trigger="introduce-modal" setIntroduce={setIntroduce} />
      <SelectRegion trigger="region-modal" />
      <SelectLanguages trigger="language-modal" setLanguages={setLanguages} />
      <SimpleInputModal
        trigger="favorite-modal"
        title="무엇을 좋아하나요?"
        placeholder="예: 샤워하면서 춤추기, 호밀빵"
        maxLength={20}
        setValue={setFavorite}
      />
      <SimpleInputModal
        trigger="hobby-modal"
        title="어떤 취미를 가지고 있나요?"
        placeholder="예: 배드민턴, 요리"
        maxLength={20}
        setValue={setHobby}
      />
      <SimpleInputModal
        trigger="pet-modal"
        title="같이 사는 반려동물이 있나요?"
        placeholder="예: 하얀 말티즈 밍키와 샐리"
        maxLength={20}
        setValue={setPet}
      />
      <SimpleInputModal
        trigger="job-modal"
        title="어떤 일을 하시나요?"
        placeholder="직업 또는 인생의 목표"
        maxLength={20}
        setValue={setJob}
      />
      <SimpleInputModal
        trigger="school-modal"
        title="어떤 학교를 졸업했나요?"
        placeholder="홈스쿨링, 고등학교, 직업학교 등 출신학교"
        maxLength={20}
        setValue={setSchool}
      />
      <ShowAge trigger="age-modal" age="90년대생" setShowAge={setShowAge} />
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

type ImageProps = {
  image: string;
  setImage: (image: string) => void;
};
const ImageArea = ({ image, setImage }: ImageProps) => {
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

    setImage(selectedImage.webPath ?? '');
  };

  return (
    <div className="bg-gray1 w-full h-[20.5rem] flex items-center justify-center relative overflow-hidden">
      {image ? (
        <IonImg src={image} className="object-cover w-full h-full" />
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

export default EditProfile;
