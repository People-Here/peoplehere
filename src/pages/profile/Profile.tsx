import {
  IonActionSheet,
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
import { Preferences } from '@capacitor/preferences';
import { FirebaseAnalytics } from '@capacitor-community/firebase-analytics';

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
import LanguageGrayIcon from '../../assets/svgs/language-gray.svg';
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
import { getNewToken } from '../../api/login';
import AutoTranslate from '../../modals/AutoTranslate';
import ThreeDotsIcon from '../../assets/svgs/three-dots.svg';
import ReportUser from '../../modals/ReportUser';
import Alert from '../../components/Alert';
import BlockUser from '../../modals/BlockUser';

import type { AxiosError } from 'axios';
import type { DeviceInfo } from '@capacitor/device';
import type { ProfileResponse } from '../../api/profile';

const Profile = () => {
  const { t, i18n } = useTranslation();

  const router = useIonRouter();
  const location = useLocation();

  const user = useUserStore((state) => state.user);
  const region = useSignInStore((state) => state.region);

  const [isMe, setIsMe] = useState(false);
  const [userInfo, setUserInfo] = useState<ProfileResponse>();
  const [placeList, setPlaceList] = useState<Tour[]>([]);
  const [currentRegion, setCurrentRegion] = useState(region.countryCode);
  const [showTranslateModal, setShowTranslateModal] = useState(false);
  const [enableAutoTranslate, setAutoTranslate] = useState(false);
  const [showUserReportSheet, setShowUserReportSheet] = useState(false);
  const [showUserReportModal, setShowUserReportModal] = useState(false);
  const [showUserBlockAlert, setShowUserBlockAlert] = useState(false);
  const [showUserBlockModal, setShowUserBlockModal] = useState(false);

  const [platform, setPlatform] = useState<DeviceInfo['platform']>('web');

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    (async () => {
      const autoTranslate = await Preferences.get({ key: 'autoTranslate' });
      setAutoTranslate(autoTranslate.value === 'true');
    })();
  }, []);

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    (async () => {
      const userId = location.pathname.split('/').at(-1);

      await FirebaseAnalytics.logEvent({
        name: 'view_profile',
        params: {
          owner_check: userId === user.id ? 'Yes' : 'No',
        },
      });
    })();
  }, []);

  const getProfileInfo = async (userId: string) => {
    const lang = await getTranslateLanguage();

    try {
      const response = await getUserProfile(userId, currentRegion);
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
    } catch (error) {
      const errorInstance = error as AxiosError;

      if (errorInstance.response?.status === 403) {
        console.warn('try to get new token...');

        try {
          await getNewToken();
          const response = await getUserProfile(userId, currentRegion);
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
        } catch (error) {
          console.error('user token as expired');
          const errorInstance = error as AxiosError;
          if (errorInstance.response?.status === 400) {
            router.push('/login');
          }
        }
      }
    }

    if (userId !== user.id) {
      const placeListResponse = await getTourListByUser(currentRegion, lang, userId);
      if (placeListResponse.status === 200) {
        setPlaceList(placeListResponse.data.tourList);
      }
    }
  };

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

      await getProfileInfo(userId);
    })();
  }, []);

  const hasAdditionalInfo =
    userInfo?.address ||
    (userInfo?.showBirth && userInfo?.birthDate) ||
    userInfo?.job ||
    userInfo?.school ||
    userInfo?.hobby ||
    userInfo?.pet ||
    userInfo?.favorite ||
    userInfo?.cityName;

  const handleClickIcon = () => {
    if (isMe) {
      router.push('/edit-profile');
    } else {
      handleClickTranslate();
    }
  };

  const handleClickTranslate = () => {
    const userId = location.pathname.split('/').at(-1);
    if (!userId) {
      return;
    }

    setShowTranslateModal(true);
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

          <IonButtons slot="end" className="gap-3">
            <IonIcon
              src={isMe ? EditIcon : enableAutoTranslate ? LanguageIcon : LanguageGrayIcon}
              className="svg-lg"
              onClick={handleClickIcon}
            />

            {!isMe && (
              <IonIcon
                src={ThreeDotsIcon}
                className="svg-lg"
                onClick={() => setShowUserReportSheet(true)}
              />
            )}
          </IonButtons>
        </IonToolbar>

        {/* image area */}
        <IonImg
          src={userInfo.profileImageUrl ?? DefaultUserImage}
          className="object-cover w-full h-[20.5rem] mt-16"
        />

        {/* content area */}
        <div className="px-4 pb-12 mt-6">
          <p className="mb-3 font-headline1 text-orange6">
            {i18n.resolvedLanguage === 'ko'
              ? `${userInfo.firstName} 님의 소개`
              : `About ${userInfo.firstName}`}
          </p>
          <div className="p-4 mb-3 bg-gray1 rounded-xl">
            <IonText className="whitespace-pre-wrap font-body1 text-gray7">
              {userInfo.introduce ?? '자기소개가 아직 없습니다.'}
            </IonText>
          </div>

          <div className="flex gap-3 mb-3">
            <div className="flex flex-col flex-1 gap-1 p-4 mb-3 bg-gray1 rounded-xl">
              <p className="font-headline3 text-gray6">{t('profile.languages')}</p>
              <p className="font-body1 text-gray7">{userInfo.languages.join(', ')}</p>
            </div>
            <div className="flex flex-col flex-1 gap-1 p-4 mb-3 bg-gray1 rounded-xl">
              <p className="font-headline3 text-gray6">{t('profile.country')}</p>
              <p className="font-body1 text-gray7">
                {i18n.resolvedLanguage === 'ko' ? region.koreanName : region.englishName}
              </p>
            </div>
          </div>

          {hasAdditionalInfo && (
            <div className="flex flex-col gap-2 p-4 bg-white border border-gray2 rounded-xl">
              {userInfo.cityName && (
                <IntroduceItem
                  icon="location"
                  title={t('profile.location')}
                  value={userInfo.cityName}
                />
              )}
              {userInfo.birthDate && (
                <IntroduceItem
                  icon="age"
                  title={t('profile.age')}
                  value={
                    i18n.resolvedLanguage === 'ko'
                      ? `${userInfo.birthDate[2]}0년대생`
                      : `${userInfo.birthDate[2]}0s`
                  }
                />
              )}
              {userInfo.job && (
                <IntroduceItem icon="job" title={t('profile.work')} value={userInfo.job} />
              )}
              {userInfo.school && (
                <IntroduceItem icon="school" title={t('profile.school')} value={userInfo.school} />
              )}
              {userInfo.hobby && (
                <IntroduceItem icon="hobby" title={t('profile.hobby')} value={userInfo.hobby} />
              )}
              {userInfo.pet && (
                <IntroduceItem icon="pet" title={t('profile.pet')} value={userInfo.pet} />
              )}
              {userInfo.favorite && (
                <IntroduceItem
                  icon="favorite"
                  title={t('profile.favorite')}
                  value={userInfo.favorite}
                />
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
                            place.placeInfo.imageInfoList.length > 0
                              ? place.placeInfo.imageInfoList[0].imageUrl
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

        <AutoTranslate
          isOpen={showTranslateModal}
          onDidDismiss={() => setShowTranslateModal(false)}
          onToggleChange={(value) => setAutoTranslate(value)}
        />

        <IonActionSheet
          isOpen={showUserReportSheet}
          onDidDismiss={() => setShowUserReportSheet(false)}
          buttons={[
            {
              text:
                i18n.resolvedLanguage === 'ko'
                  ? `${userInfo.firstName} 님 신고하기`
                  : `Report ${userInfo.firstName}`,
              handler: () => setShowUserReportModal(true),
            },
            {
              text:
                i18n.resolvedLanguage === 'ko'
                  ? `${userInfo.firstName} 님 차단하기`
                  : `Block ${userInfo.firstName}`,
              handler: () => setShowUserBlockAlert(true),
            },
            {
              text: t('progress.cancel'),
              role: 'cancel',
            },
          ]}
        />

        <ReportUser
          isOpen={showUserReportModal}
          onDidDismiss={() => setShowUserReportModal(false)}
          userId={userInfo.id}
          userName={userInfo.firstName}
        />

        <Alert
          isOpen={showUserBlockAlert}
          onDismiss={() => setShowUserBlockAlert(false)}
          title={
            i18n.resolvedLanguage === 'ko'
              ? `${userInfo.firstName} 님을 차단할까요?`
              : `Block ${userInfo.firstName}?`
          }
          subTitle={t('profile.blockP2')}
          buttons={[
            { text: t('progress.cancel') },
            { text: t('profile.continueBlock'), onClick: () => setShowUserBlockModal(true) },
          ]}
        />

        <BlockUser
          isOpen={showUserBlockModal}
          onDidDismiss={() => setShowUserBlockModal(false)}
          userId={userInfo.id}
          userName={userInfo.firstName}
        />
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
    <div className="flex">
      <IonIcon icon={iconMapper[icon]} className="svg-md mr-1.5 shrink-0 mt-0.5" />

      <p className="mr-1 font-body1 text-gray6 whitespace-nowrap">{title}</p>

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
  const { t } = useTranslation();

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
              {t('post.onTag')}
            </IonText>
            <IonIcon icon={MessageIcon} className="svg-xs" />
          </div>
        ) : (
          <div className="flex items-center gap-1 px-1.5 py-[0.1875rem] bg-gray1.5 rounded-lg w-fit">
            <IonText className="font-semibold text-[0.625rem] -tracking-[0.2px] leading-4 text-gray6">
              {t('post.offTag')}
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
