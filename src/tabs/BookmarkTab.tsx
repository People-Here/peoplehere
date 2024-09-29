import {
  IonContent,
  IonIcon,
  IonImg,
  IonInfiniteScroll,
  IonInfiniteScrollContent,
  IonPage,
  IonText,
  IonToolbar,
  useIonRouter,
} from '@ionic/react';
import { useEffect, useLayoutEffect, useState } from 'react';
import { Device } from '@capacitor/device';
import { useTranslation } from 'react-i18next';
import { FirebaseAnalytics } from '@capacitor-community/firebase-analytics';

import HeartFilledIcon from '../assets/svgs/heart-filled.svg';
import useLogin from '../hooks/useLogin';
import { getBookmarkList, likeTour } from '../api/tour';
import useSignInStore from '../stores/signIn';
import { getNewToken } from '../api/login';
import { getTranslateLanguage } from '../utils/translate';
import StatusChip from '../components/StatusChip';
import useUserStore from '../stores/user';

import type { DeviceInfo } from '@capacitor/device';
import type { BookmarkedTour, User } from '../api/tour';
import type { AxiosError } from 'axios';

const BookmarkTab = () => {
  const { t } = useTranslation();

  const router = useIonRouter();
  const { checkLogin } = useLogin();

  const region = useSignInStore((state) => state.region);
  const userId = useUserStore((state) => state.user.id);

  const [list, setList] = useState<BookmarkedTour[]>([]);
  const [isEndOfList, setIsEndOfList] = useState(false);

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

        if (errorInstance.response?.status === 403) {
          console.warn('try to get new token...');

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

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    (async () => {
      const isLoggedIn = await checkLogin();

      await FirebaseAnalytics.setScreenName({
        screenName: 'bookmark',
        nameOverride: 'Bookmark',
      });
    })();
  }, []);

  const removeFromBookmark = async (tourId: string, tourTitle: string, authorId: string) => {
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
    } finally {
      const isLoggedIn = await checkLogin();

      await FirebaseAnalytics.logEvent({
        name: 'click_heart',
        params: {
          login: isLoggedIn ? 'Yes' : 'No',
          screen_name: 'bookmark',
          heart_status: 'Inactive',
          post_id: tourId,
          post_title: tourTitle,
          p_user_id: authorId,
        },
      });
    }
  };

  const onClickTourItem = async (
    tourId: string,
    tourTitle: string,
    placeName: string,
    placePhotoCount: number,
    authorId: string,
    authorName: string,
  ) => {
    await FirebaseAnalytics.logEvent({
      name: 'click_post',
      params: {
        screen_name: 'bookmark',
        publisher_check: userId === authorId ? 'Yes' : 'No',
        place_name: tourTitle,
        post_title: placeName,
        post_id: tourId,
        p_user_id: authorId,
        p_user_name: authorName,
        post_photo_count: placePhotoCount,
      },
    });
  };

  const onClickHeartIcon = async (tourId: string, tourTitle: string, authorId: string) => {
    const isLoggedIn = await checkLogin();

    await FirebaseAnalytics.logEvent({
      name: 'click_heart',
      params: {
        login: isLoggedIn ? 'Yes' : 'No',
        screen_name: 'bookmark',
        heart_status: 'false',
        post_id: tourId,
        post_title: tourTitle,
        p_user_id: authorId,
      },
    });
  };

  const fetchMoreList = async () => {
    if (list.length === 0 || isEndOfList) return;

    const lang = await getTranslateLanguage();

    try {
      const response = await getBookmarkList(
        region.countryCode.toUpperCase(),
        lang,
        list.at(-1)?.id,
      );
      setList((prev) => [...prev, ...response.data.tourList]);

      if (response.data.tourList.length < 10) {
        setIsEndOfList(true);
      }
    } catch (error) {
      console.error('fail to fetch more list', error);
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
          <p className="pl-0 font-headline1 text-gray8">{t('savedPosts.title')}</p>
        </IonToolbar>

        {/* body */}
        {list.length === 0 ? (
          <div className="flex items-center justify-center h-full -mt-14">
            <p className="text-center whitespace-pre-wrap font-headline2 text-gray6">
              {t('savedPosts.noList')}
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-3 px-4 pb-20 mt-16">
            {list.map((item) => (
              <div
                key={item.id}
                onClick={async () => {
                  await onClickTourItem(
                    item.id,
                    item.title,
                    item.placeInfo.name,
                    item.placeInfo.imageInfoList.length,
                    String(item.userInfo.id),
                    item.userInfo.firstName,
                  );
                  router.push(`/tour/${item.id}`);
                }}
              >
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
                  onClickIcon={async () => {
                    await onClickHeartIcon(item.id, item.title, String(item.userInfo.id));
                    await removeFromBookmark(item.id, item.title, String(item.userInfo.id));
                  }}
                />
              </div>
            ))}

            <IonInfiniteScroll
              className="h-5"
              onIonInfinite={async (event) => {
                await fetchMoreList();
                await event.target.complete();
              }}
            >
              <IonInfiniteScrollContent loadingSpinner="circular" />
            </IonInfiniteScroll>
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
