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

import ArrowLeftIcon from '../../assets/svgs/arrow-left.svg';
import LanguagueIcon from '../../assets/svgs/language.svg';
import ShareIcon from '../../assets/svgs/share.svg';
import ChevronRightIcon from '../../assets/svgs/chevron-right.svg';
import HeartLineRedIcon from '../../assets/svgs/heart-line-red.svg';
import { getTourDetail, likeTour, type TourDetail as TourDetailType } from '../../api/tour';
import LogoRunning from '../../components/LogoRunning';
import { themeColors } from '../../constants/theme';
import SendMessage from '../../modals/SendMessage';
import useUserStore from '../../stores/user';
import ThreeDotGrayIcon from '../../assets/svgs/three-dots-gray.svg';
import FullImage from '../../modals/FullImage';
import FullPageMap from '../../modals/FullPageMap';
import MapIcon from '../../assets/svgs/map.svg';
import { getNewToken } from '../../api/login';
import useLogin from '../../hooks/useLogin';
import useSignInStore from '../../stores/signIn';
import { getTranslateLanguage } from '../../utils/translate';

const TourDetail = () => {
  const { t } = useTranslation();

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

  const [currentLanguage, setCurrentLanguage] = useState(
    region.countryCode === 'KR' ? 'KOREAN' : 'ENGLISH',
  );

  useLayoutEffect(() => {
    const tourId = location.pathname.split('/').at(-1);
    if (!tourId) return;

    setTourId(tourId);

    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    (async () => {
      const lang = await getTranslateLanguage();
      const response = await getTourDetail(tourId, region.countryCode, lang);

      if (response.status === 200) {
        setTourDetail(response.data);
      }
    })();
  }, [location.pathname]);

  useEffect(() => {
    if (!tourDetail) return;

    if (user.id === tourDetail?.userInfo.id.toString()) {
      setIsMine(true);
    }
  }, [tourDetail, user.id]);

  const onClickLike = async () => {
    try {
      await likeTour(tourId);
    } catch (error) {
      await getNewToken();
      await likeTour(tourId);

      const response = await getTourDetail(tourId, region.countryCode, currentLanguage);
      setTourDetail(response.data);

      console.error('Failed to like tour', error);
    }
  };

  const onClickTranslate = async () => {
    const translatedLang = currentLanguage === 'KOREAN' ? 'ENGLISH' : 'KOREAN';

    const response = await getTourDetail(tourId, region.countryCode, translatedLang);
    setTourDetail(response.data);
    setCurrentLanguage(translatedLang);
  };

  if (!tourDetail) {
    return <LogoRunning />;
  }

  return (
    <IonPage>
      <IonContent fullscreen>
        {/* header */}
        <IonToolbar className="px-4 bg-white h-14">
          <IonButtons slot="start">
            <IonIcon src={ArrowLeftIcon} className="svg-lg" onClick={() => router.goBack()} />
          </IonButtons>

          <IonButtons slot="end" className="flex items-center gap-3">
            <IonIcon src={LanguagueIcon} className="svg-lg" onClick={onClickTranslate} />
            <IonIcon src={ShareIcon} className="svg-lg" />
          </IonButtons>
        </IonToolbar>

        <Link
          className="flex justify-center w-full mt-6 mb-12"
          to={`/detail-profile/${tourDetail.userInfo.id.toString()}`}
        >
          <UserImage
            src={tourDetail.userInfo.profileImageUrl}
            name={tourDetail.userInfo.firstName}
          />
        </Link>

        <div className={`${themeColors[tourDetail.theme].background}`}>
          <div
            className={`absolute rounded-full w-[37.5rem] h-[37.5rem] ${themeColors[tourDetail.theme].background} mx-auto top-40 -left-[calc(18.75rem-50%)] -z-10`}
          />

          <div className="flex flex-col items-center gap-6 mb-16 px-9">
            <div
              className={`flex items-center ${themeColors[tourDetail.theme].footer} rounded py-0.5 px-1.5 w-fit`}
            >
              <IonText className={`font-body1 ${themeColors[tourDetail.theme].language}`}>
                {t('common.availableLanguages')}
              </IonText>
              <Divider />
              <IonText className={`font-body1 ${themeColors[tourDetail.theme].language}`}>
                {tourDetail.userInfo.languages.join(', ')}
              </IonText>
            </div>

            <p
              className={`leading-6 text-center ${themeColors[tourDetail.theme].content} font-body1`}
            >
              {tourDetail.userInfo.introduce}
            </p>
          </div>

          <div className="px-4 pb-32">
            <p className={`mb-4 text-center font-headline1 ${themeColors[tourDetail.theme].title}`}>
              {tourDetail.title}
            </p>

            <ImageCarousel
              images={tourDetail.placeInfo.imageUrlList.map((image) => image.imageUrl)}
            />

            <PlaceInfo
              title={tourDetail.placeInfo.name}
              address={tourDetail.placeInfo.address}
              theme={tourDetail.theme}
            />

            <div
              className={`p-4 flex flex-col gap-2.5 ${themeColors[tourDetail.theme].cardBackground} rounded-xl mt-2`}
            >
              <p className={`font-headline3 ${themeColors[tourDetail.theme].cardTitle}`}>
                {t('tour.detail')}
              </p>
              <p className={`font-body2 ${themeColors[tourDetail.theme].cardContent}`}>
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
                <IonIcon src={isMine ? ThreeDotGrayIcon : HeartLineRedIcon} className="svg-lg" />
              </div>

              {isMine ? (
                <button
                  className={`w-full ${themeColors[tourDetail.theme].buttonText} button-primary button-lg ${themeColors[tourDetail.theme].button} font-subheading1 active:bg-orange4`}
                  onClick={() => router.push(`/post/${tourId}`)}
                >
                  수정하기
                </button>
              ) : (
                <button
                  className={`w-full ${themeColors[tourDetail.theme].buttonText} button-primary button-lg ${themeColors[tourDetail.theme].button} font-subheading1 active:bg-orange4`}
                  onClick={() => {
                    const isLoggedIn = checkLogin();
                    if (!isLoggedIn) return;

                    setOpenMessageModal(true);
                  }}
                >
                  {i18next.resolvedLanguage === 'ko'
                    ? `${tourDetail.userInfo.firstName} 님에게 쪽지하기`
                    : `Message ${tourDetail.userInfo.firstName}`}
                </button>
              )}
            </div>
          </IonToolbar>
        </IonFooter>

        <FullPageMap
          trigger="place-map-modal"
          lat={37.5409582}
          lng={127.0684686}
          title={tourDetail.placeInfo.name}
          address={tourDetail.placeInfo.address}
          thumbnail={tourDetail.placeInfo.imageUrlList[0].imageUrl}
        />

        <SendMessage
          isOpen={openMessageModal}
          tourId={tourId}
          receiverId={tourDetail.userInfo.id.toString()}
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
    <div className="overflow-hidden rounded-xl w-[100px] h-[140px] relative flex justify-center shrink-0 border-[0.5px] border-gray5.5">
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
};
const PlaceInfo = ({ title, address, theme }: PlaceInfoProps) => {
  return (
    <div
      id="place-map-modal"
      className={`flex items-center justify-between p-3 ${themeColors[theme].cardBackground} rounded-xl`}
    >
      <div className="flex items-center gap-3">
        <IonIcon src={MapIcon} className="svg-xl shrink-0" />

        <div className="flex flex-col gap-0.5">
          <p className={`${themeColors[theme].cardTitle} font-subheading2`}>{title}</p>
          <p className={`font-caption2 ${themeColors[theme].cardAddress}`}>{address}</p>
        </div>
      </div>

      <IonIcon icon={ChevronRightIcon} className="w-[1.375rem] h-[1.375rem] shrink-0" />
    </div>
  );
};

const ImageCarousel = ({ images }: { images: string[] }) => {
  const carouselRef = useRef<HTMLDivElement>(null);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [showFullImage, setShowFullImage] = useState(false);

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
        onClick={() => setShowFullImage(true)}
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

      {showFullImage && <FullImage images={images} setShow={setShowFullImage} />}
    </>
  );
};

export default TourDetail;
