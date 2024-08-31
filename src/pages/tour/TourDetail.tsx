/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import {
  IonActionSheet,
  IonButtons,
  IonContent,
  IonFooter,
  IonIcon,
  IonImg,
  IonPage,
  IonText,
  IonToolbar,
  useIonRouter,
} from '@ionic/react';
import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import i18next from 'i18next';
import { Device } from '@capacitor/device';
import { Preferences } from '@capacitor/preferences';
import { FirebaseAnalytics } from '@capacitor-community/firebase-analytics';

import ArrowLeftIcon from '../../assets/svgs/arrow-left.svg';
import LanguagueIcon from '../../assets/svgs/language.svg';
import LanguageGrayIcon from '../../assets/svgs/language-gray.svg';
import ChevronRightIcon from '../../assets/svgs/chevron-right.svg';
import HeartLineRedIcon from '../../assets/svgs/heart-line-red.svg';
import HeartFilledIcon from '../../assets/svgs/heart-filled.svg';
import { getTourDetail, likeTour, type TourDetail as TourDetailType } from '../../api/tour';
import LogoRunning from '../../components/LogoRunning';
import { themeColors } from '../../constants/theme';
import SendMessage from '../../modals/SendMessage';
import useUserStore from '../../stores/user';
import ThreeDotIcon from '../../assets/svgs/three-dots.svg';
import ThreeDotGrayIcon from '../../assets/svgs/three-dots-gray.svg';
import FullImage from '../../modals/FullImage';
import MapIcon from '../../assets/svgs/map.svg';
import MapWhiteIcon from '../../assets/svgs/map-white.svg';
import { getNewToken } from '../../api/login';
import useLogin from '../../hooks/useLogin';
import useSignInStore from '../../stores/signIn';
import { getTranslateLanguage } from '../../utils/translate';
import { findKoreanLanguageName } from '../../utils/find';
import { getUserProfile } from '../../api/profile';
import { capitalizeFirstLetter } from '../../utils/mask';
import AutoTranslate from '../../modals/AutoTranslate';

import type { DeviceInfo } from '@capacitor/device';

const TourDetail = () => {
  const { t, i18n } = useTranslation();

  const router = useIonRouter();
  const location = useLocation();

  const user = useUserStore((state) => state.user);
  const region = useSignInStore((state) => state.region);
  const { checkLogin } = useLogin();

  const [tourId, setTourId] = useState('');
  const [tourDetail, setTourDetail] = useState<TourDetailType>();

  const [isMine, setIsMine] = useState(false);
  const [openEditSheet, setOpenEditSheet] = useState(false);
  const [openMessageModal, setOpenMessageModal] = useState(false);
  const [showTranslateModal, setShowTranslateModal] = useState(false);
  const [showFullImage, setShowFullImage] = useState(false);
  const [enableAutoTranslate, setAutoTranslate] = useState(false);

  const [needProfileInfo, setNeedProfileInfo] = useState(false);

  const [currentLanguage, setCurrentLanguage] = useState(
    region.countryCode === 'KR' ? 'KOREAN' : 'ENGLISH',
  );

  const [platform, setPlatform] = useState<DeviceInfo['platform']>('web');

  useLayoutEffect(() => {
    const tourId = location.pathname.split('/').at(-1);
    if (!tourId) return;

    setTourId(tourId);

    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    (async () => {
      const platformInfo = await Device.getInfo();
      setPlatform(platformInfo.platform);

      await fetchTourDetail(tourId);

      const response = await getUserProfile(user.id, region.countryCode);
      if (
        !response.data.introduce ||
        !response.data.profileImageUrl ||
        !response.data.languages.length
      ) {
        setNeedProfileInfo(true);
      }
    })();
  }, [location.pathname]);

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    (async () => {
      const autoTranslate = await Preferences.get({ key: 'autoTranslate' });
      setAutoTranslate(autoTranslate.value === 'true');
    })();
  }, []);

  useEffect(() => {
    if (!tourDetail) return;

    if (user.id === tourDetail?.userInfo.id.toString()) {
      setIsMine(true);
    }
  }, [tourDetail, user.id]);

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    FirebaseAnalytics.setScreenName({
      screenName: 'post',
      nameOverride: 'Post',
    });
  }, []);

  const fetchTourDetail = async (tourId: string) => {
    const lang = await getTranslateLanguage();
    const response = await getTourDetail(tourId, region.countryCode, lang);

    if (response.status === 200) {
      setTourDetail(response.data);
    }
  };

  const onClickLike = async () => {
    if (needProfileInfo) {
      router.push('/edit-profile');
      return;
    }

    const isLoggedIn = await checkLogin();
    if (!isLoggedIn) return;

    try {
      await likeTour(tourId);
      await fetchTourDetail(tourId);
    } catch (error) {
      await getNewToken();
      await likeTour(tourId);
      await fetchTourDetail(tourId);

      console.error('Failed to like tour', error);
    }
  };

  const onClickTranslate = async () => {
    setShowTranslateModal(true);
    await FirebaseAnalytics.logEvent({
      name: 'click_translation_icon',
      params: {},
    });
    // const translatedLang = currentLanguage === 'KOREAN' ? 'ENGLISH' : 'KOREAN';

    // const response = await getTourDetail(tourId, region.countryCode, translatedLang);
    // setTourDetail(response.data);
    // setCurrentLanguage(translatedLang);
  };

  // const onClickShare = async () => {
  //   if (!tourDetail) return;

  //   const shareLang = region.countryCode === 'KR' ? 'KOREAN' : 'ENGLISH';

  //   const contents = {
  //     KOREAN: {
  //       title: '피플히어의 외국인 친구들을 만나 보세요.',
  //       dialogTitle: `${tourDetail.placeInfo.name}에서 외국인 친구랑 놀래?`,
  //       url: tourDetail.placeInfo.imageInfoList[0].imageUrl,
  //     },
  //     ENGLISH: {
  //       title: `Meet people here in ${tourDetail.placeInfo.name}`,
  //       dialogTitle: `Wanna meet people here in ${tourDetail.placeInfo.name}?`,
  //       url: tourDetail.placeInfo.imageInfoList[0].imageUrl,
  //     },
  //   };

  //   await Share.share({
  //     title: contents[shareLang].title,
  //     dialogTitle: contents[shareLang].dialogTitle,
  //     url: `https://odongdong.site/tabs/main`,
  //   });
  // };

  if (!tourDetail) {
    return <LogoRunning />;
  }

  return (
    <IonPage>
      <IonContent fullscreen>
        {/* header */}
        {!showFullImage && (
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

            <IonButtons slot="end" className="flex items-center gap-3">
              <IonIcon
                src={enableAutoTranslate ? LanguagueIcon : LanguageGrayIcon}
                className="svg-lg"
                onClick={onClickTranslate}
              />
              {/* <IonIcon src={ShareIcon} className="svg-lg" onClick={onClickShare} /> */}
            </IonButtons>
          </IonToolbar>
        )}
        <Link
          className="flex justify-center w-full mt-16 mb-12"
          to={`/detail-profile/${tourDetail.userInfo.id.toString()}`}
          onClick={async () => {
            await FirebaseAnalytics.logEvent({
              name: 'click_profile',
              params: {
                screen_name: location.pathname,
              },
            });
          }}
        >
          <UserImage
            src={tourDetail.userInfo.profileImageUrl}
            name={tourDetail.userInfo.firstName}
          />
        </Link>

        <div className={`${themeColors[tourDetail.theme].background}`}>
          <div
            className={`absolute rounded-full w-[37.5rem] h-[37.5rem] ${themeColors[tourDetail.theme].background} mx-auto top-40 -left-[calc(18.75rem-50%)] -z-10 shrink-0`}
          />

          <div className="flex flex-col items-center gap-6 mb-16 px-9">
            <div
              className={`flex items-center ${themeColors[tourDetail.theme].languageBackground} rounded py-0.5 px-1.5 w-fit`}
            >
              <IonText className={`font-body1 ${themeColors[tourDetail.theme].language}`}>
                {t('user.languages')}
              </IonText>
              <Divider />
              <IonText className={`font-body1 ${themeColors[tourDetail.theme].language}`}>
                {i18n.resolvedLanguage === 'ko'
                  ? findKoreanLanguageName(tourDetail.userInfo.languages)
                  : tourDetail.userInfo.languages
                      .map((lang) => capitalizeFirstLetter(lang))
                      .join(', ')}
              </IonText>
            </div>

            <p
              className={`text-center ${themeColors[tourDetail.theme].content} font-subheading2 whitespace-pre-wrap`}
            >
              {tourDetail.userInfo.introduce}
            </p>
          </div>

          <div className="px-4 pb-28">
            <p className={`mb-4 text-center font-headline1 ${themeColors[tourDetail.theme].title}`}>
              {tourDetail.title}
            </p>

            <ImageCarousel
              images={tourDetail.placeInfo.imageInfoList.map((image) => image.imageUrl)}
              show={showFullImage}
              setShow={setShowFullImage}
            />

            <PlaceInfo
              title={tourDetail.placeInfo.name}
              address={tourDetail.placeInfo.address}
              theme={tourDetail.theme}
              lat={tourDetail.placeInfo.latitude}
              lng={tourDetail.placeInfo.longitude}
            />

            <div
              className={`p-4 flex flex-col gap-2 ${themeColors[tourDetail.theme].cardBackground} rounded-xl mt-2`}
            >
              <p className={`font-headline3 ${themeColors[tourDetail.theme].cardTitle}`}>
                {t('post.description')}
              </p>
              <p
                className={`font-subheading2 whitespace-pre-wrap ${themeColors[tourDetail.theme].cardContent}`}
              >
                {tourDetail.description}
              </p>
            </div>
          </div>
        </div>

        <IonFooter
          class="ion-no-border"
          className={`fixed bottom-0 left-0 right-0 ${themeColors[tourDetail.theme].footer}`}
        >
          <IonToolbar className="p-4">
            <div className="flex gap-3">
              <div
                className={`flex items-center justify-center border ${themeColors[tourDetail.theme].buttonBorder} ${themeColors[tourDetail.theme].likeButton} rounded-xl w-14 h-[3.25rem] shrink-0`}
                onClick={isMine ? () => setOpenEditSheet(true) : onClickLike}
              >
                {isMine ? (
                  <IonIcon
                    icon={tourDetail.theme === 'black' ? ThreeDotGrayIcon : ThreeDotIcon}
                    className="svg-lg"
                  />
                ) : (
                  <IonIcon
                    icon={tourDetail.like ? HeartFilledIcon : HeartLineRedIcon}
                    className="svg-lg"
                  />
                )}
              </div>

              {isMine ? (
                <button
                  className={`w-full ${themeColors[tourDetail.theme].buttonText} button-primary button-lg ${themeColors[tourDetail.theme].button} font-subheading1 active:bg-orange4`}
                  onClick={() => router.push(`/edit-post/${tourId}`)}
                >
                  수정하기
                </button>
              ) : (
                <>
                  {tourDetail.directMessageStatus ? (
                    <button
                      className={`w-full ${themeColors[tourDetail.theme].buttonText} button-primary button-lg ${themeColors[tourDetail.theme].button} font-subheading1 active:bg-orange4`}
                      onClick={async () => {
                        await FirebaseAnalytics.logEvent({
                          name: 'click_message',
                          params: {
                            post_id: '',
                            post_title: tourDetail.title,
                            p_user_id: tourDetail.userInfo.id.toString(),
                            p_user_name:
                              tourDetail.userInfo.firstName + ' ' + tourDetail.userInfo.lastName,
                            p_user_languauges: tourDetail.userInfo.languages.join(', '),
                          },
                        });

                        if (needProfileInfo) {
                          router.push('/edit-profile');
                          return;
                        }

                        const isLoggedIn = await checkLogin();
                        if (isLoggedIn) {
                          setOpenMessageModal(true);
                        }
                      }}
                    >
                      {i18next.resolvedLanguage === 'ko'
                        ? `${tourDetail.userInfo.firstName} 님에게 쪽지하기`
                        : `Message ${tourDetail.userInfo.firstName}`}
                    </button>
                  ) : (
                    <button className="w-full button-gray button-lg font-subheading1 text-gray6">
                      {t('post.blockMessage')}
                    </button>
                  )}
                </>
              )}
            </div>
          </IonToolbar>
        </IonFooter>

        <SendMessage
          isOpen={openMessageModal}
          tourId={tourId}
          receiverId={tourDetail.userInfo.id.toString()}
          receiverName={tourDetail.userInfo.firstName}
          onDidDismiss={() => setOpenMessageModal(false)}
        />

        <IonActionSheet
          isOpen={openEditSheet}
          onDidDismiss={() => setOpenEditSheet(false)}
          buttons={[
            {
              text: '상태 변경하기',
              handler: () => {
                router.push(`/change-status/${tourId}`);
              },
            },
            {
              text: '취소',
              role: 'cancel',
              data: {
                action: 'cancel',
              },
            },
          ]}
        />

        <AutoTranslate
          isOpen={showTranslateModal}
          onDidDismiss={() => setShowTranslateModal(false)}
          onToggleChange={async (value) => {
            setAutoTranslate(value);
            await fetchTourDetail(tourId);
          }}
        />
      </IonContent>
    </IonPage>
  );
};

type ImageProps = {
  src: string;
  name: string;
};
const UserImage = ({ src, name }: ImageProps) => {
  return (
    <div className="overflow-hidden rounded-xl w-[100px] h-[140px] relative flex justify-center shrink-0 border-[0.5px] border-gray5.5 bg-white">
      <IonImg className="object-cover w-full h-full" src={src} alt="user profile" />

      <div
        className="h-[72px] absolute bottom-0 left-0 right-0"
        style={{
          background: 'linear-gradient(180deg, rgba(27, 29, 31, 0.00) 0%, #1B1D1F 100%)',
        }}
      ></div>
      <IonText className="absolute overflow-hidden font-body1 bottom-3 text-gray2 text-ellipsis">
        {name}
      </IonText>
    </div>
  );
};

const Divider = () => {
  return <div className="w-[2px] bg-gray3 h-[14px] mx-2 rounded-full" />;
};

type PlaceInfoProps = {
  title: string;
  address: string;
  theme: string;
  lat: number;
  lng: number;
};
const PlaceInfo = ({ title, address, theme, lat, lng }: PlaceInfoProps) => {
  return (
    <Link to={`/place-map?title=${title}&address=${address}&lat=${lat}&lng=${lng}`}>
      <div
        className={`flex items-center justify-between p-3 ${themeColors[theme].cardBackground} rounded-xl`}
      >
        <div className="flex items-center gap-3">
          <IonIcon src={theme === 'black' ? MapWhiteIcon : MapIcon} className="svg-xl shrink-0" />

          <div className="flex flex-col gap-0.5">
            <p className={`${themeColors[theme].cardTitle} font-subheading2`}>{title}</p>
            <p className={`font-caption2 ${themeColors[theme].cardAddress}`}>{address}</p>
          </div>
        </div>

        <IonIcon icon={ChevronRightIcon} className="w-[1.375rem] h-[1.375rem] shrink-0" />
      </div>
    </Link>
  );
};

const ImageCarousel = ({
  images,
  show,
  setShow,
}: {
  images: string[];
  show: boolean;
  setShow: (show: boolean) => void;
}) => {
  const carouselRef = useRef<HTMLDivElement>(null);

  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const carousel = carouselRef.current;

    if (!carousel) return;

    const slides = carousel.querySelectorAll('img');
    const slidesArray = Array.from(slides);

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // eslint-disable-next-line no-undef
            setCurrentIndex(slidesArray.indexOf(entry.target as HTMLImageElement));
          }
        });
      },
      { root: carousel, threshold: 0.5 },
    );
    slides.forEach((slide) => observer.observe(slide));

    return () => slides.forEach((slide) => observer.unobserve(slide));
  }, []);

  return (
    <>
      <div
        className="relative w-full h-[16.25rem] overflow-hidden mb-5 rounded-[20px] border-[0.5px] border-gray6"
        onClick={() => setShow(true)}
      >
        <div
          ref={carouselRef}
          className="flex w-full h-full overflow-x-scroll shrink-0 snap-x snap-mandatory no-scrollbar"
        >
          {/* image carousel */}
          {images.map((image) => (
            <img
              key={image}
              src={image}
              className="object-cover w-full h-full overflow-hidden shrink-0 snap-center"
              alt={`place image`}
            />
          ))}
        </div>

        {/* gradient */}
        <div
          className="absolute bottom-0 left-0 right-0 w-full opacity-70 h-[3.375rem]"
          style={{ background: 'linear-gradient(0deg, #1B1D1F 0%, rgba(27, 29, 31, 0.00) 100%)' }}
        />

        {/* slide indicator */}
        <div
          className="absolute bottom-4 right-2.5 px-2.5 py-1 rounded-2xl flex items-center gap-1"
          style={{ background: 'rgba(27, 29, 31, 0.80)' }}
        >
          <p className="font-caption1 text-gray1">{currentIndex + 1}</p>
          <p className="font-caption1 text-gray1">|</p>
          <p className="font-caption1 text-gray5">{images.length}</p>
        </div>
      </div>

      {show && <FullImage images={images} setShow={setShow} />}
    </>
  );
};

export default TourDetail;
