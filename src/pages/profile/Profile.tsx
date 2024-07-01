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
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { Device } from '@capacitor/device';

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
import { findKoreanLanguageName } from '../../utils/find';
import MessageIcon from '../../assets/svgs/message-line-color.svg';
import MessageBlockedIcon from '../../assets/svgs/message-blocked.svg';
import { getTranslateLanguage } from '../../utils/translate';
import { capitalizeFirstLetter } from '../../utils/mask';

import type { DeviceInfo } from '@capacitor/device';
import type { ProfileResponse } from '../../api/profile';

const Profile = () => {
  const { i18n } = useTranslation();

  const router = useIonRouter();
  const location = useLocation();

  const user = useUserStore((state) => state.user);
  const region = useSignInStore((state) => state.region);

  const [isMe, setIsMe] = useState(false);
  const [userInfo, setUserInfo] = useState<ProfileResponse>();
  const [placeList, setPlaceList] = useState<Tour[]>([]);
  const [currentRegion, setCurrentRegion] = useState(region.countryCode);

  const [platform, setPlatform] = useState<DeviceInfo['platform']>('web');

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
      const platformInfo = await Device.getInfo();
      setPlatform(platformInfo.platform);

      const lang = await getTranslateLanguage();
      const response = await getUserProfile(userId, currentRegion);

      if (userId !== user.id) {
        const placeListResponse = await getTourListByUser(currentRegion, lang, userId);
        if (placeListResponse.status === 200) {
          setPlaceList(placeListResponse.data.tourList);
        }
      }

      if (response.status === 200) {
        setUserInfo(response.data);

        if (i18n.resolvedLanguage === 'ko') {
          setUserInfo({
            ...response.data,
            languages: response.data.languages.map((lang) => findKoreanLanguageName(lang)),
          });
        } else {
          setUserInfo({
            ...response.data,
            languages: response.data.languages.map((lang) => capitalizeFirstLetter(lang)),
          });
        }
      }
    })();
  }, []);

  const hasAdditionalInfo =
    userInfo?.address ||
    (userInfo?.showBirth && userInfo?.birthDate) ||
    userInfo?.job ||
    userInfo?.school ||
    userInfo?.hobby ||
    userInfo?.pet ||
    userInfo?.favorite;

  const handleClickIcon = async () => {
    if (isMe) {
      router.push('/edit-profile');
    } else {
      await handleClickTranslate();
    }
  };

  const handleClickTranslate = async () => {
    const userId = location.pathname.split('/').at(-1);
    if (!userId) {
      return;
    }

    if (currentRegion === 'KR') {
      setCurrentRegion('EN');
      const response = await getUserProfile(userId, 'US');

      setUserInfo(response.data);

      if (i18n.resolvedLanguage === 'ko') {
        setUserInfo({
          ...response.data,
          languages: response.data.languages.map((lang) => findKoreanLanguageName(lang)),
        });
      } else {
        setUserInfo({
          ...response.data,
          languages: response.data.languages.map((lang) => capitalizeFirstLetter(lang)),
        });
      }
    } else {
      setCurrentRegion('KR');
      const response = await getUserProfile(userId, 'KR');

      setUserInfo(response.data);

      if (i18n.resolvedLanguage === 'ko') {
        setUserInfo({
          ...response.data,
          languages: response.data.languages.map((lang) => findKoreanLanguageName(lang)),
        });
      } else {
        setUserInfo({
          ...response.data,
          languages: response.data.languages.map((lang) => capitalizeFirstLetter(lang)),
        });
      }
    }
  };

  if (!userInfo) {
    return <LogoRunning />;
  }

  return (
    <IonPage>
      <IonContent fullscreen>
        {/* header */}
        <IonToolbar
          slot="fixed"
          className={
            platform === 'web'
              ? 'px-4 bg-white h-14'
              : platform === 'android'
                ? 'px-4 bg-white h-14 flex items-end'
                : 'px-4 bg-white h-24 flex items-end'
          }
        >
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
          className="object-cover w-full h-[20.5rem] mt-16"
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

          {hasAdditionalInfo && (
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
          )}

          {/* 유저가 만든 장소 */}
          {!isMe && (
            <>
              <p className="mt-8 mb-3 font-headline1 text-orange6">
                {userInfo.firstName} 님의 장소
              </p>

              <div className="flex flex-col gap-4">
                {placeList.length > 0 ? (
                  <>
                    {placeList.map((place) => (
                      <Link key={place.id} to={`/tour/${place.id.toString()}`}>
                        <TourInfo
                          id={place.id.toString()}
                          image={
                            place.placeInfo.imageUrlList.length > 0
                              ? place.placeInfo.imageUrlList[0].imageUrl
                              : ''
                          }
                          title={place.title}
                          placeName={place.placeInfo.name}
                          district={place.placeInfo.district}
                          available={true}
                        />
                      </Link>
                    ))}
                  </>
                ) : (
                  <NoPlace />
                )}
              </div>
            </>
          )}
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

type TourInfoProps = {
  id: string;
  image: string;
  title: string;
  placeName: string;
  district: string;
  available?: boolean;
};
const TourInfo = ({ image, title, placeName, district, available }: TourInfoProps) => {
  return (
    <div className="relative flex gap-3 p-3 bg-white border rounded-xl border-gray2">
      <IonImg
        src={image}
        className="w-[4.5rem] h-[4.5rem] shrink-0 object-cover rounded-xl overflow-hidden"
      />

      <div>
        {available ? (
          <div className="flex items-center gap-1 px-1.5 py-[0.1875rem] bg-orange1 rounded-lg w-fit">
            <IonText className="font-semibold text-[0.625rem] -tracking-[0.2px] leading-4 text-orange5">
              쪽지 받기
            </IonText>
            <IonIcon icon={MessageIcon} className="svg-xs" />
          </div>
        ) : (
          <div className="flex items-center gap-1 px-1.5 py-[0.1875rem] bg-gray1.5 rounded-lg w-fit">
            <IonText className="font-semibold text-[0.625rem] -tracking-[0.2px] leading-4 text-gray6">
              쪽지 마감
            </IonText>
            <IonIcon icon={MessageBlockedIcon} className="svg-xs" />
          </div>
        )}

        <div className="mt-1">
          <p className="font-headline3 text-gray8">{title}</p>
          <p className="font-body1 text-gray6">
            {placeName}
            {district && <span className="font-body2 text-gray6"> | {district}</span>}
          </p>
        </div>
      </div>
    </div>
  );
};

const NoPlace = () => {
  return (
    <Link to="/post" className="flex flex-col items-center gap-6 mt-3 py-9">
      <p className="text-center whitespace-pre-wrap font-headline3 text-gray5.5">
        아직 장소가 없어요.
      </p>
    </Link>
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
