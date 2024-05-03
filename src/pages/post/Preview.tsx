/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import {
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
import { Fragment, useLayoutEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Preferences } from '@capacitor/preferences';

import ArrowLeftIcon from '../../assets/svgs/arrow-left.svg';
import LanguagueIcon from '../../assets/svgs/language.svg';
import ShareIcon from '../../assets/svgs/share.svg';
import ChevronRightIcon from '../../assets/svgs/chevron-right.svg';
import ChevronUpIcon from '../../assets/svgs/chevron-up.svg';
import usePostPlaceStore from '../../stores/place';
import useUserStore from '../../stores/user';
import { getUserProfile } from '../../api/profile';
import LogoRunning from '../../components/LogoRunning';
import { imageToFile } from '../../utils/image';
import { postTour } from '../../api/tour';
import { getNewToken } from '../../api/login';

import type { AxiosError } from 'axios';
import type { ProfileResponse } from '../../api/profile';

const themeColors: any = {
  black: {
    background: 'bg-gray8',
    cardBackground: 'bg-gray7',
    footer: 'bg-gray8',
    button: 'bg-orange6',
    buttonText: 'text-white',
    buttonBorder: 'border-gray6',
    language: 'text-gray2',
    content: 'text-gray3',
    title: 'text-gray2',
    cardTitle: 'text-gray1',
    cardAddress: 'text-gray5',
    cardContent: 'text-gray4',
  },
  pink: {
    background: 'bg-[#F4B7C6]',
    cardBackground: 'bg-[#F6C5D1]',
    footer: 'bg-[#F095AB]',
    button: 'bg-white',
    buttonText: 'text-gray6',
    buttonBorder: 'border-white',
    language: 'text-white',
    content: 'text-gray8',
    title: 'text-[#4F353B]',
    cardTitle: 'text-gray8',
    cardAddress: 'text-gray6',
    cardContent: 'text-gray7',
  },
  yellow: {
    background: 'bg-[#FAE09F]',
    cardBackground: 'bg-[#FFEBB6]',
    footer: 'bg-[#FCCF5D]',
    button: 'bg-white',
    buttonText: 'text-gray6',
    buttonBorder: 'border-white',
    language: 'text-[#4A2C1B]',
    content: 'text-gray8',
    title: 'text-[#4F353B]',
    cardTitle: 'text-gray8',
    cardAddress: 'text-gray6',
    cardContent: 'text-gray7',
  },
};

const Preview = () => {
  const { t } = useTranslation();

  const router = useIonRouter();
  const { place, title, description, images } = usePostPlaceStore((state) => state);
  const user = useUserStore((state) => state.user);

  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const [theme, setTheme] = useState('black');
  const [userInfo, setUserInfo] = useState<ProfileResponse>();

  useLayoutEffect(() => {
    if (!user.id) return;

    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    (async () => {
      const response = await getUserProfile(user.id, 'KR');

      if (response.status === 200) {
        setUserInfo(response.data);
      }
    })();
  }, [user.id]);

  const uploadPost = async () => {
    const imageBlobs = await Promise.all(images.map((image) => imageToFile(image)));

    const formData = new FormData();
    formData.append('placeId', place.id);
    formData.append('title', title);
    formData.append('description', description);
    formData.append('theme', theme);
    imageBlobs.forEach((blob) => {
      formData.append('images', blob);
    });

    try {
      await postTour(formData);
      router.push('/');
    } catch (error) {
      console.error('failed with uploading post', error);

      const errorInstance = error as AxiosError;

      if (errorInstance.response?.status === 401) {
        const tokens = await getNewToken();
        await Preferences.set({ key: 'accessToken', value: tokens.data });

        await postTour(formData);
        router.push('/', 'root', 'replace');
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
        <IonToolbar className="px-4 bg-white h-14">
          <IonButtons slot="start">
            <IonIcon src={ArrowLeftIcon} className="svg-lg" onClick={() => router.goBack()} />
          </IonButtons>

          <IonButtons slot="end" className="flex items-center gap-3">
            <IonIcon src={LanguagueIcon} className="svg-lg" />
            <IonIcon src={ShareIcon} className="svg-lg" />
          </IonButtons>
        </IonToolbar>

        <div className="flex justify-center w-full mt-6 mb-12">
          <UserImage src={userInfo.profileImageUrl} name={userInfo.firstName} />
        </div>

        <div className={`relative pb-20 ${themeColors[theme].background}`}>
          <div
            className={`absolute rounded-full w-[37.5rem] h-[37.5rem] ${themeColors[theme].background} -top-28 -left-[7.1875rem] -z-10`}
          />

          <div className="flex flex-col items-center gap-6 mb-16 px-9">
            <div
              className={`flex items-center ${themeColors[theme].footer} rounded py-0.5 px-1.5 w-fit`}
            >
              <p className={`font-body1 ${themeColors[theme].language}`}>
                {t('common.availableLanguages')}
              </p>
              <Divider />
              <p className={`font-body1 ${themeColors[theme].language}`}>
                {userInfo.languages.join(', ')}
              </p>
            </div>

            <p className={`leading-6 text-center ${themeColors[theme].content} font-body1`}>
              {userInfo.introduce}
            </p>
          </div>

          <div className="px-4 pb-40">
            <p className={`mb-4 text-center font-headline1 ${themeColors[theme].title}`}>{title}</p>

            <ImageCarousel images={images} />

            <PlaceInfo
              image={images[0]}
              title={place.title}
              address={place.address}
              theme={theme}
            />

            <div
              className={`p-4 flex flex-col gap-2.5 ${themeColors[theme].cardBackground} rounded-xl mt-2`}
            >
              <p className={`font-headline3 ${themeColors[theme].cardTitle}`}>{t('tour.detail')}</p>
              <p className={`font-body2 ${themeColors[theme].cardContent}`}>{description}</p>
            </div>
          </div>
        </div>

        <SelectTheme currentTheme={theme} setTheme={setTheme} onClick={uploadPost} />
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
    <div className="overflow-hidden rounded-xl w-[100px] h-full relative flex justify-center shrink-0 border-[0.5px] border-gray5.5">
      <IonImg className="w-[100px] h-full object-cover" src={src} alt="user profile" />

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
  image: string;
  title: string;
  address: string;
  theme: string;
};
const PlaceInfo = ({ image, title, address, theme }: PlaceInfoProps) => {
  return (
    <div
      className={`flex items-center justify-between p-4 ${themeColors[theme].cardBackground} rounded-xl`}
    >
      <div className="flex items-center gap-3">
        <IonImg
          src={image}
          alt={`place-${title}`}
          className="object-cover overflow-hidden rounded-lg w-11 h-11"
        />

        <div className="flex flex-col gap-0.5">
          <p className={`${themeColors[theme].cardTitle} font-subheading2`}>{title}</p>
          <p className={`font-caption2 ${themeColors[theme].cardAddress}`}>{address}</p>
        </div>
      </div>

      <IonIcon icon={ChevronRightIcon} className="w-[1.375rem] h-[1.375rem]" />
    </div>
  );
};

const themes = {
  black: 'w-[3.75rem] h-[3.75rem] rounded-full bg-gray8',
  pink: 'w-[3.75rem] h-[3.75rem] rounded-full bg-[#F4B7C6]',
  yellow: 'w-[3.75rem] h-[3.75rem] rounded-full bg-[#FAE09F]',
};
type ThemeProps = {
  currentTheme: string;
  setTheme: (theme: string) => void;
  onClick: () => void;
};
const SelectTheme = ({ currentTheme, setTheme, onClick }: ThemeProps) => {
  const { t } = useTranslation();

  const [expand, setExpand] = useState(true);
  const [buttonClicked, setButtonClicked] = useState(false);

  return (
    <IonFooter
      class="ion-no-border"
      className="fixed bottom-0 left-0 right-0 bg-white rounded-t-[20px]"
    >
      <div className="flex flex-col gap-4 p-4">
        <div className="flex items-center justify-between w-full">
          <p className="font-headline2 text-gray8">스킨 색상 선택</p>
          <div
            className="py-0.5 px-2 rounded-[26px] bg-gray2 flex items-center justify-center"
            onClick={() => setExpand((prev) => !prev)}
          >
            <IonIcon src={ChevronUpIcon} className={expand ? 'svg-md rotate-180' : 'svg-md'} />
          </div>
        </div>

        {expand && (
          <div className="flex gap-[1.125rem]">
            {Object.keys(themes).map((theme) => (
              <Fragment key={theme}>
                {currentTheme === theme ? (
                  <div className="border-2 rounded-full border-orange5">
                    <div className={themes[theme as keyof typeof themes]} />
                  </div>
                ) : (
                  <div
                    key={theme}
                    className={themes[theme as keyof typeof themes]}
                    onClick={() => setTheme(theme)}
                  />
                )}
              </Fragment>
            ))}
          </div>
        )}

        <button
          className="w-full text-white bg-orange5 button-lg font-subheading1"
          onClick={() => {
            onClick();
            setButtonClicked(true);
          }}
          disabled={buttonClicked}
        >
          {t('newTour.post')}
        </button>
      </div>
    </IonFooter>
  );
};

const ImageCarousel = ({ images }: { images: string[] }) => {
  const [current, setCurrent] = useState(0);

  return (
    <div className="relative w-full h-[16.25rem] overflow-hidden mb-5 bg-gray3 rounded-[20px] border-[0.5px] border-gray6">
      <div className="flex w-full h-full overflow-x-scroll shrink-0 snap-x snap-mandatory">
        {/* image carousel */}
        {images.map((image) => (
          <IonImg
            key={image}
            src={image}
            className="object-cover w-full h-full overflow-hidden shrink-0 snap-center"
          />
        ))}
      </div>

      {/* gradient */}
      <div
        className="absolute bottom-0 left-0 right-0 w-full opacity-70 h-[3.375rem] rounded-b-[20px]"
        style={{ background: 'linear-gradient(0deg, #1B1D1F 0%, rgba(27, 29, 31, 0.00) 100%)' }}
      />

      {/* slide indicator */}
      <div
        className="absolute bottom-4 right-2.5 px-2.5 py-1 rounded-2xl flex items-center gap-1"
        style={{ background: 'rgba(27, 29, 31, 0.80)' }}
      >
        <p className="font-caption1 text-gray1">{current + 1}</p>
        <p className="font-caption1 text-gray1">|</p>
        <p className="font-caption1 text-gray5">12</p>
      </div>
    </div>
  );
};

export default Preview;
