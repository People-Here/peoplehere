import {
  IonContent,
  IonIcon,
  IonImg,
  IonPage,
  IonText,
  IonToolbar,
  useIonRouter,
} from '@ionic/react';
import { useLayoutEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Device } from '@capacitor/device';

import HeartFilledIcon from '../assets/svgs/heart-filled.svg';
import useLogin from '../hooks/useLogin';
import { getBookmarkList, likeTour } from '../api/tour';
import useSignInStore from '../stores/signIn';
import { getNewToken } from '../api/login';
import { getTranslateLanguage } from '../utils/translate';
import StatusChip from '../components/StatusChip';

import type { DeviceInfo } from '@capacitor/device';
import type { BookmarkedTour, User } from '../api/tour';
import type { AxiosError } from 'axios';

const BookmarkTab = () => {
  const router = useIonRouter();
  const { checkLogin } = useLogin();

  const region = useSignInStore((state) => state.region);

  const [list, setList] = useState<BookmarkedTour[]>([]);

  const [platform, setPlatform] = useState<DeviceInfo['platform']>('web');

  useLayoutEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    (async () => {
      const platformInfo = await Device.getInfo();
      setPlatform(platformInfo.platform);

      const lang = await getTranslateLanguage();

      const isLoggedIn = await checkLogin();
      if (!isLoggedIn) {
        return;
      }

      try {
        const response = await getBookmarkList(region.countryCode.toUpperCase(), lang);

        setList(response.data.tourList);
      } catch (error) {
        const errorInstance = error as AxiosError;
        console.warn('try to get new token...');

        if (errorInstance.response?.status === 403) {
          try {
            await getNewToken();
            const response = await getBookmarkList(region.countryCode.toUpperCase(), lang);
            setList(response.data.tourList);
          } catch (error) {
            console.error('user token as expired');
            const errorInstance = error as AxiosError;
            if (errorInstance.response?.status === 400) {
              router.push('/login');
            }
          }
        }
      }
    })();
  }, []);

  const removeFromBookmark = async (tourId: string) => {
    const lang = await getTranslateLanguage();

    try {
      await likeTour(tourId);
      const response = await getBookmarkList(region.countryCode.toUpperCase(), lang);
      setList(response.data.tourList);
    } catch (error) {
      await getNewToken();
      await likeTour(tourId);
      const response = await getBookmarkList(region.countryCode.toUpperCase(), lang);
      setList(response.data.tourList);

      console.error('fail to remove from bookmark', error);
    }
  };

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
          <p className="pl-0 font-headline1 text-gray8">관심 목록</p>
        </IonToolbar>

        {/* body */}
        {list.length === 0 ? (
          <div className="flex items-center justify-center h-full -mt-14">
            <p className="font-headline2 text-gray6">관심 목록이 비어있어요.</p>
          </div>
        ) : (
          <div className="flex flex-col gap-3 px-4 pb-20 mt-16">
            {list.map((item) => (
              <Link key={item.id} to={`/tour/${item.id}`}>
                <ListItem
                  title={item.title}
                  placeName={item.placeInfo.name}
                  district={item.placeInfo.district}
                  images={item.placeInfo.imageInfoList.map((image) => image.imageUrl)}
                  available={item.userInfo.directMessageStatus}
                  user={{
                    id: item.userInfo.id.toString(),
                    name: item.userInfo.firstName,
                    imageUrl: item.userInfo.profileImageUrl,
                  }}
                  onClickIcon={() => removeFromBookmark(item.id)}
                />
              </Link>
            ))}
          </div>
        )}
      </IonContent>
    </IonPage>
  );
};

type ListItemProps = {
  title: string;
  placeName: string;
  district: string;
  images: string[];
  available: boolean;
  user: {
    id: string;
    name: string;
    imageUrl: string;
  };
  onClickIcon: () => void;
};
const ListItem = ({
  title,
  placeName,
  district,
  images,
  available,
  user,
  onClickIcon,
}: ListItemProps) => {
  return (
    <div className="flex flex-col gap-3 p-3 border border-gray2 rounded-2xl">
      <div className="-mr-4">
        {/* title area */}
        <div className="flex flex-col gap-1.5 mb-3 pr-4">
          <StatusChip available={available} />

          <div className="pl-1 flex flex-col gap-0.5">
            <div className="flex items-center justify-between">
              <IonText className="font-headline3 text-gray8">{title}</IonText>
              <IonIcon
                icon={HeartFilledIcon}
                className="svg-lg shrink-0"
                onClick={(e) => {
                  e.preventDefault();
                  onClickIcon();
                }}
              />
            </div>

            <div className="flex items-center">
              <IonText className="font-caption1 text-gray6">{placeName}</IonText>
              {district && <Divider />}
              <IonText className="font-caption2 text-gray6">{district}</IonText>
            </div>
          </div>
        </div>

        {/* content area */}
        <div className="flex gap-2 h-[140px] pr-4">
          <UserImage firstName={user.name} profileImageUrl={user.imageUrl} />
          <SingleImage image={images[0]} />
        </div>
      </div>
    </div>
  );
};

const Divider = () => {
  return <div className="w-[1px] bg-gray6 h-3 mx-1.5" />;
};

const UserImage = ({ firstName, profileImageUrl }: Pick<User, 'firstName' | 'profileImageUrl'>) => {
  return (
    <div className="overflow-hidden rounded-xl w-[100px] h-full relative flex justify-center shrink-0">
      <IonImg className="w-[100px] h-full object-cover" src={profileImageUrl} alt="user profile" />

      <div
        className="h-[72px] absolute bottom-0 left-0 right-0"
        style={{
          background: 'linear-gradient(180deg, rgba(27, 29, 31, 0.00) 0%, #1B1D1F 100%)',
        }}
      ></div>
      <IonText className="absolute overflow-hidden text-sm font-bold leading-6 tracking-tight bottom-3 font-suite text-gray2 text-ellipsis">
        {firstName}
      </IonText>
    </div>
  );
};

const SingleImage = ({ image }: { image: string }) => {
  return (
    <IonImg className="object-cover w-full overflow-hidden rounded-xl" src={image} alt="place" />
  );
};

export default BookmarkTab;
