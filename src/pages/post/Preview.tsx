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
import { useLayoutEffect, useState } from 'react';

import ArrowLeftIcon from '../../assets/svgs/arrow-left.svg';
import LanguagueIcon from '../../assets/svgs/language.svg';
import ShareIcon from '../../assets/svgs/share.svg';
import ChevronRightIcon from '../../assets/svgs/chevron-right.svg';
import ChevronUpIcon from '../../assets/svgs/chevron-up.svg';
import usePostPlaceStore from '../../stores/place';
import useUserStore from '../../stores/user';
import { getUserProfile } from '../../api/profile';

import type { ProfileResponse } from '../../api/profile';

const Preview = () => {
  const router = useIonRouter();
  const { place, title, description, images } = usePostPlaceStore((state) => state);
  const user = useUserStore((state) => state.user);

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

  const themeColors = {
    black: 'bg-gray8',
    pink: 'bg-[#F4B7C6]',
    yellow: 'bg-[#FAE09F]',
  };

  if (!userInfo) {
    return <>loading...</>;
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
          <UserImage src="https://picsum.photos/seed/picsum/200/300" name={user.firstName} />
        </div>

        <div className={`relative ${themeColors[theme as keyof typeof themeColors]}`}>
          <div
            className={`absolute rounded-full w-[37.5rem] h-[37.5rem] ${themeColors[theme as keyof typeof themeColors]} -top-28 -left-[7.1875rem] -z-10`}
          />

          <div className="flex flex-col items-center gap-6 mb-16 px-9">
            <div className="flex items-center bg-gray7 rounded py-0.5 px-1.5 w-fit">
              <p className="font-body1 text-gray2">구사언어</p>
              <Divider />
              <p className="font-body1 text-gray2">{userInfo.languages.join(', ')}</p>
            </div>

            <p className="leading-6 text-center text-white font-body1">{userInfo.introduce}</p>
          </div>

          <div className="px-4 pb-40">
            <p className="mb-4 text-center font-headline1 text-gray1">{title}</p>

            <div className="w-full h-[16.25rem] rounded-[20px] border-[0.5px] border-gray5.5 overflow-hidden mb-5">
              <IonImg src={images[0]} alt="place image" className="object-cover w-full h-full" />
            </div>

            <PlaceInfo image={images[0]} title={place.title} address={place.address} />

            <div className="p-4 flex flex-col gap-2.5 bg-gray7 rounded-xl mt-2">
              <p className="font-headline3 text-gray1">우리 여기서 같이 뭐할까?</p>
              <p className="font-body2 text-gray2">{description}</p>
            </div>
          </div>
        </div>

        <SelectTheme currentTheme={theme} setTheme={setTheme} />
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
};
const PlaceInfo = ({ image, title, address }: PlaceInfoProps) => {
  return (
    <div className="flex items-center justify-between p-4 bg-gray7 rounded-xl">
      <div className="flex items-center gap-3">
        <IonImg
          src={image}
          alt={`place-${title}`}
          className="object-cover overflow-hidden rounded-lg w-11 h-11"
        />

        <div className="flex flex-col gap-0.5">
          <p className="text-white font-subheading2">{title}</p>
          <p className="font-caption2 text-gray5">{address}</p>
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
};
const SelectTheme = ({ currentTheme, setTheme }: ThemeProps) => {
  const [expand, setExpand] = useState(true);

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
              <>
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
              </>
            ))}
          </div>
        )}

        <button className="w-full text-white bg-orange5 button-lg font-subheading1">
          장소 올리기
        </button>
      </div>
    </IonFooter>
  );
};

export default Preview;