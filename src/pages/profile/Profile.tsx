import {
  IonButtons,
  IonContent,
  IonIcon,
  IonImg,
  IonPage,
  IonText,
  IonTitle,
  IonToolbar,
  useIonRouter,
} from '@ionic/react';
import { useLocation } from 'react-router';
import { useEffect, useState } from 'react';

import useUserStore from '../../stores/user';
import ArrowLeftIcon from '../../assets/svgs/arrow-left.svg';
import EditIcon from '../../assets/svgs/edit.svg';
import LocationIcon from '../../assets/svgs/location.svg';
import CakeIcon from '../../assets/svgs/cake.svg';
import BagIcon from '../../assets/svgs/bag.svg';
import SchoolIcon from '../../assets/svgs/school.svg';
import ClockIcon from '../../assets/svgs/clock.svg';
import DogIcon from '../../assets/svgs/dog.svg';
import DoubleHeartIcon from '../../assets/svgs/double-heart.svg';
import LanguageIcon from '../../assets/svgs/language.svg';
import useSignInStore from '../../stores/signIn';
import DefaultUserImage from '../../assets/images/default-user.png';
import { getUserProfile } from '../../api/profile';
import LogoRunning from '../../components/LogoRunning';
import { getTourListByUser, type Tour } from '../../api/tour';

import type { ProfileResponse } from '../../api/profile';

const Profile = () => {
  const router = useIonRouter();
  const location = useLocation();

  const user = useUserStore((state) => state.user);
  const region = useSignInStore((state) => state.region);

  const [isMe, setIsMe] = useState(false);
  const [userInfo, setUserInfo] = useState<ProfileResponse>();
  const [lang, setLang] = useState('KOREAN');
  const [placeList, setPlaceList] = useState<Tour[]>([]);

  useEffect(() => {
    const userId = location.pathname.split('/').at(-1);
    if (!userId) {
      return;
    }

    if (userId === user.id) {
      setIsMe(true);
    }

    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    (async () => {
      const response = await getUserProfile(userId, region.countryCode);
      const placeListResponse = await getTourListByUser(
        region.countryCode.toUpperCase(),
        lang,
        userId,
      );

      if (response.status === 200) {
        setUserInfo(response.data);
      }

      if (placeListResponse.status === 200) {
        setPlaceList(placeListResponse.data.tourList);
      }
    })();
  }, []);

  const handleClickIcon = () => {
    if (isMe) {
      router.push('/profile/edit');
    }
  };

  if (!userInfo) {
    return <LogoRunning />;
  }

  return (
    <IonPage>
      <IonContent fullscreen>
        {/* header */}
        <IonToolbar className="px-4 h-14">
          <IonButtons slot="start">
            <IonIcon src={ArrowLeftIcon} className="svg-lg" onClick={() => router.goBack()} />
          </IonButtons>

          <IonTitle class="ion-text-center" className="font-headline3 text-gray8">
            {userInfo.firstName}
          </IonTitle>

          <IonButtons slot="end">
            <IonIcon
              src={isMe ? EditIcon : LanguageIcon}
              className="svg-lg"
              onClick={handleClickIcon}
            />
          </IonButtons>
        </IonToolbar>

        {/* image area */}
        <IonImg
          src={userInfo.profileImageUrl ?? DefaultUserImage}
          className="object-cover w-full h-[20.5rem]"
        />

        {/* content area */}
        <div className="px-4 pb-12 mt-6">
          <p className="mb-3 font-headline1 text-orange6">{userInfo.firstName} 님의 소개</p>
          <div className="p-4 mb-3 bg-gray1 rounded-xl">
            <IonText className="whitespace-pre-wrap font-body1 text-gray7">
              {userInfo.introduce ?? '자기소개가 아직 없습니다.'}
            </IonText>
          </div>

          <div className="flex gap-3 mb-3">
            <div className="flex flex-col flex-1 gap-1 p-4 mb-3 bg-gray1 rounded-xl">
              <p className="font-headline3 text-gray6">구사 언어</p>
              <p className="font-body1 text-gray7">{userInfo.languages.join(', ')}</p>
            </div>
            <div className="flex flex-col flex-1 gap-1 p-4 mb-3 bg-gray1 rounded-xl">
              <p className="font-headline3 text-gray6">출신 국가</p>
              <p className="font-body1 text-gray7">{region.koreanName}</p>
            </div>
          </div>

          <div className="flex flex-col gap-2 p-4 bg-white border border-gray2 rounded-xl">
            {userInfo.address && (
              <IntroduceItem icon="location" title="거주지" value={userInfo.address} />
            )}
            {userInfo.birthDate && (
              <IntroduceItem icon="age" title="나이" value={`${userInfo.birthDate[2]}0년대생`} />
            )}
            {userInfo.job && <IntroduceItem icon="job" title="직업" value={userInfo.job} />}
            {userInfo.school && (
              <IntroduceItem icon="school" title="출신학교" value={userInfo.school} />
            )}
            {userInfo.hobby && <IntroduceItem icon="hobby" title="취미" value={userInfo.hobby} />}
            {userInfo.pet && <IntroduceItem icon="pet" title="반려동물" value={userInfo.pet} />}
            {userInfo.favorite && (
              <IntroduceItem icon="favorite" title="좋아하는 것" value={userInfo.favorite} />
            )}
          </div>
        </div>
      </IonContent>
    </IonPage>
  );
};

type IntroduceItemProps = {
  icon: string;
  title: string;
  value: string;
};
const IntroduceItem = ({ icon, title, value }: IntroduceItemProps) => {
  return (
    <div className="flex items-center">
      <IonIcon icon={iconMapper[icon]} className="svg-md mr-1.5 shrink-0" />

      <p className="font-body1 text-gray6 whitespace-nowrap">{title}</p>
      <Divider />
      <p className="font-body1 text-gray6">{value}</p>
    </div>
  );
};

const Divider = () => {
  return <div className="w-[2px] bg-gray4 h-[14px] mx-2 rounded-full" />;
};

const iconMapper: Record<string, string> = {
  location: LocationIcon,
  age: CakeIcon,
  job: BagIcon,
  school: SchoolIcon,
  hobby: ClockIcon,
  pet: DogIcon,
  favorite: DoubleHeartIcon,
};

export default Profile;
