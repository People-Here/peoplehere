import {
  IonButtons,
  IonContent,
  IonIcon,
  IonImg,
  IonPage,
  IonText,
  IonToolbar,
  useIonRouter,
} from '@ionic/react';
import { useLayoutEffect, useState } from 'react';
import { useLocation } from 'react-router';

import ArrowLeftIcon from '../../assets/svgs/arrow-left.svg';
import LanguagueIcon from '../../assets/svgs/language.svg';
import ShareIcon from '../../assets/svgs/share.svg';
import ChevronRightIcon from '../../assets/svgs/chevron-right.svg';
import { getTourDetail, type TourDetail as TourDetailType } from '../../api/tour';

const TourDetail = () => {
  const router = useIonRouter();
  const location = useLocation();

  const [tourDetail, setTourDetail] = useState<TourDetailType>();

  useLayoutEffect(() => {
    const tourId = location.pathname.split('/').at(-1);
    if (!tourId) return;

    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    (async () => {
      const response = await getTourDetail(tourId, 'ORIGIN');

      if (response.status === 200) {
        setTourDetail(response.data);
      }
    })();
  }, [location.pathname]);

  const themeColors = {
    black: 'bg-gray8',
    pink: 'bg-[#F4B7C6]',
    yellow: 'bg-[#FAE09F]',
  };

  if (!tourDetail) {
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
          <UserImage
            src="https://picsum.photos/seed/picsum/200/300"
            name={tourDetail.userInfo.firstName}
          />
        </div>

        <div className={`relative ${themeColors[tourDetail.theme as keyof typeof themeColors]}`}>
          <div
            className={`absolute rounded-full w-[37.5rem] h-[37.5rem] ${themeColors[tourDetail.theme as keyof typeof themeColors]} -top-28 -left-[7.1875rem] -z-10`}
          />

          <div className="flex flex-col items-center gap-6 mb-16 px-9">
            <div className="flex items-center bg-gray7 rounded py-0.5 px-1.5 w-fit">
              <p className="font-body1 text-gray2">구사언어</p>
              <Divider />
              <p className="font-body1 text-gray2">{tourDetail.userInfo.languages.join(', ')}</p>
            </div>

            <p className="leading-6 text-center text-white font-body1">
              {tourDetail.userInfo.introduce}
            </p>
          </div>

          <div className="px-4 pb-40">
            <p className="mb-4 text-center font-headline1 text-gray1">{tourDetail.title}</p>

            <div className="w-full h-[16.25rem] rounded-[20px] border-[0.5px] border-gray5.5 overflow-hidden mb-5">
              <IonImg
                src={tourDetail.placeInfo.imageUrlList[0].imageUrl}
                alt="place image"
                className="object-cover w-full h-full"
              />
            </div>

            <PlaceInfo
              image={tourDetail.placeInfo.imageUrlList[0].imageUrl}
              title={tourDetail.placeInfo.name}
              address={tourDetail.placeInfo.address}
            />

            <div className="p-4 flex flex-col gap-2.5 bg-gray7 rounded-xl mt-2">
              <p className="font-headline3 text-gray1">우리 여기서 같이 뭐할까?</p>
              <p className="font-body2 text-gray2">{tourDetail.description}</p>
            </div>
          </div>
        </div>
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

export default TourDetail;
