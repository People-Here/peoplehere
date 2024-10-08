import {
  IonContent,
  IonHeader,
  IonIcon,
  IonImg,
  IonInfiniteScroll,
  IonInfiniteScrollContent,
  IonRefresher,
  IonRefresherContent,
  IonText,
  useIonRouter,
} from '@ionic/react';
import { Link, useLocation } from 'react-router-dom';
import { useEffect, useLayoutEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FirebaseAnalytics } from '@capacitor-community/firebase-analytics';

import SearchIcon from '../../assets/svgs/search.svg';
import HeartLineRedIcon from '../../assets/svgs/heart-line-red.svg';
import HeartFilledIcon from '../../assets/svgs/heart-filled.svg';
import EmptyListIcon from '../../assets/svgs/empty-result.svg';
import useSignInStore from '../../stores/signIn';
import { getTourList, likeTour, searchTour } from '../../api/tour';
import SearchPlace from '../../modals/SearchPlace';
import LogoRunning from '../../components/LogoRunning';
import StatusChip from '../../components/StatusChip';
import useLogin from '../../hooks/useLogin';
import { getNewToken } from '../../api/login';
import { getTranslateLanguage } from '../../utils/translate';
import AvatarLoading from '../../assets/images/user-loading.gif';
import ImageLoading from '../../assets/images/place-loading.gif';
import ImageLoadingLarge from '../../assets/images/place-loading-large.gif';
import LocationGrayIcon from '../../assets/svgs/location-gray.svg';
import CloseIcon from '../../assets/svgs/close.svg';
import useUserStore from '../../stores/user';
import Toast from '../../toasts/Toast';

import type { AxiosError } from 'axios';
import type { RefresherEventDetail } from '@ionic/react';
import type { Place, Tour, User } from '../../api/tour';

const Home = () => {
  const { t } = useTranslation();

  const router = useIonRouter();
  const location = useLocation();

  const [list, setList] = useState<Tour[]>([]);
  const [loading, setLoading] = useState(true);
  const [openSearchModal, setOpenSearchModal] = useState(false);
  const [openLoginToast, setOpenLoginToast] = useState(false);
  const [isEndOfList, setIsEndOfList] = useState(false);

  const region = useSignInStore((state) => state.region);
  const user = useUserStore((state) => state.user);

  const { requestLogout } = useLogin();

  useLayoutEffect(() => {
    setLoading(true);

    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    (async () => {
      const lang = await getTranslateLanguage();

      if (location.search) {
        const params = new URLSearchParams(location.search);
        const keyword = params.get('search') ?? '';

        const { data, status } = await searchTour(keyword, region.countryCode.toUpperCase(), lang);

        if (status === 200) {
          setList(data.tourList);
        }
      } else {
        try {
          const response = await getTourList(region.countryCode.toUpperCase(), lang);
          setList(response.data.tourList);
        } catch (error) {
          const errorInstance = error as AxiosError;

          if (errorInstance.response?.status === 403) {
            console.warn('try to get new token...');

            try {
              await getNewToken();
              const response = await getTourList(region.countryCode.toUpperCase(), lang);
              setList(response.data.tourList);
            } catch (error) {
              console.error('user token as expired');
              const errorInstance = error as AxiosError;
              if (errorInstance.response?.status === 400) {
                await requestLogout();
                setOpenLoginToast(true);
              }
            }
          }
        }
      }

      setLoading(false);
    })();
  }, [location.search]);

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    FirebaseAnalytics.setScreenName({
      screenName: 'main',
      nameOverride: 'Main',
    });
  }, []);

  const handleRefresh = async (event: CustomEvent<RefresherEventDetail>) => {
    const lang = await getTranslateLanguage();

    if (location.search) {
      const keyword = location.search.split('=')[1];

      const { data, status } = await searchTour(keyword, region.countryCode.toUpperCase(), lang);

      if (status === 200) {
        setList(data.tourList);
      }
    } else {
      const { data, status } = await getTourList(region.countryCode.toUpperCase(), lang);

      if (status === 200) {
        setList(data.tourList);
      }
    }

    event.detail.complete();
  };

  const fetchMoreList = async () => {
    if (list.length === 0 || isEndOfList) {
      return;
    }

    const lang = await getTranslateLanguage();

    if (location.search) {
      const params = new URLSearchParams(location.search);
      const keyword = params.get('search') ?? '';

      const { data, status } = await searchTour(keyword, region.countryCode.toUpperCase(), lang);

      if (status === 200) {
        if (data.tourList.length < 10) {
          setIsEndOfList(true);
        }

        setList(data.tourList);
      }

      return;
    }

    try {
      const response = await getTourList(region.countryCode.toUpperCase(), lang, list.at(-1)?.id);
      setList((prev) => [...prev, ...response.data.tourList]);

      if (response.data.tourList.length < 10) {
        setIsEndOfList(true);
      }
    } catch (error) {
      console.warn('fail to update list');
    }
  };

  if (loading) {
    return <LogoRunning />;
  }

  return (
    <div>
      <SearchBar setOpenSearchModal={setOpenSearchModal} />

      <IonContent fullscreen>
        <div className="px-4 pt-16 mt-3">
          <IonRefresher slot="fixed" onIonRefresh={handleRefresh} pullMin={20} pullMax={50}>
            <IonRefresherContent
              pullingText={'당겨서 새로고침'}
              refreshingText={'새로고침 중...'}
            />
          </IonRefresher>

          <div className="flex flex-col mt-[1.625rem] gap-[1.875rem]">
            {list.length === 0 ? (
              <div className="mt-60">
                <div className="flex flex-col items-center gap-8">
                  <IonIcon icon={EmptyListIcon} className="w-[67px] h-[53px]" />

                  <IonText className="font-headline3 text-gray5.5">
                    {t('searchBar.noResults')}
                  </IonText>
                </div>
              </div>
            ) : (
              <>
                {list.map((tour) => (
                  <Link
                    key={tour.id}
                    to={`/tour/${tour.id}`}
                    onClick={async () => {
                      await FirebaseAnalytics.logEvent({
                        name: 'click_post',
                        params: {
                          screen_name: 'main',
                          publisher_check: tour.userInfo.id === user.id ? 'true' : 'false',
                          place_name: tour.placeInfo.name,
                          post_title: tour.title,
                          post_id: tour.id,
                          p_user_id: tour.userInfo.id,
                          p_user_name: tour.userInfo.firstName + ' ' + tour.userInfo.lastName,
                          post_photo_count: tour.placeInfo.imageInfoList.length,
                        },
                      });

                      await FirebaseAnalytics.setUserProperty({
                        name: 'click_post_title',
                        value: tour.title,
                      });
                    }}
                  >
                    <TourItem
                      id={tour.id}
                      title={tour.title}
                      categoryList={tour.categoryList}
                      like={tour.like}
                      place={tour.placeInfo}
                      user={tour.userInfo}
                      setList={setList}
                      theme={tour.theme}
                      directMessageStatus={tour.directMessageStatus}
                    />
                  </Link>
                ))}

                <IonInfiniteScroll
                  onIonInfinite={async (event) => {
                    await fetchMoreList();
                    await event.target.complete();
                  }}
                >
                  <IonInfiniteScrollContent loadingSpinner="circular" />
                </IonInfiniteScroll>
              </>
            )}
          </div>

          <SearchPlace
            isOpen={openSearchModal}
            onClickItem={(item) => router.push(`/home?search=${item.title}`)}
            from="MAIN"
            onWillDismiss={() => setOpenSearchModal(false)}
          />
        </div>
      </IonContent>

      <Toast
        isOpen={openLoginToast}
        onDismiss={() => setOpenLoginToast(false)}
        type="error-small"
        message={'로그인이 만료되었어요.\n다시 로그인해주세요.'}
      />
    </div>
  );
};

type SearchBarProps = {
  setOpenSearchModal: (value: boolean) => void;
};
const SearchBar = ({ setOpenSearchModal }: SearchBarProps) => {
  const { t, i18n } = useTranslation();
  const location = useLocation();
  const router = useIonRouter();

  const { region } = useSignInStore((state) => state);

  const params = new URLSearchParams(location.search);
  const keyword = params.get('search');

  return (
    <IonHeader
      slot="fixed"
      className="fixed top-0 left-0 right-0 bg-white w-full px-4 pb-3 z-10 pt-[calc(.75rem+var(--ion-safe-area-top))]"
    >
      <div
        className="w-full h-16 flex items-center pl-6 pr-5 justify-between bg-gray1 rounded-[30px]"
        onClick={async () => {
          if (!keyword) {
            setOpenSearchModal(true);
          }

          await FirebaseAnalytics.logEvent({
            name: 'click_searchbar',
            params: {},
          });
        }}
      >
        <div className="flex flex-col">
          <IonText className="font-headline3 text-gray7">
            {keyword ?? t('explore.searchBar')}
          </IonText>
          {!keyword && (
            <IonText className="font-caption2 text-gray5">
              {i18n.resolvedLanguage === 'ko' ? region.koreanName : region.englishName}
            </IonText>
          )}
        </div>

        <IonIcon
          icon={keyword ? CloseIcon : SearchIcon}
          className="svg-lg"
          onClick={() => {
            if (keyword) {
              router.push('/home');
            }
          }}
        />
      </div>
    </IonHeader>
  );
};

type TourItemProps = {
  place: Place;
  user: User;
  setList: (list: Tour[]) => void;
};

const TourItem = ({
  id,
  title,
  like,
  place,
  user,
  setList,
  directMessageStatus,
}: Omit<Tour, 'placeInfo' | 'userInfo'> & TourItemProps) => {
  const { checkLogin } = useLogin();
  const region = useSignInStore((state) => state.region);

  const onClickLike = async (id: string) => {
    const lang = await getTranslateLanguage();

    const isLoggedIn = await checkLogin();
    if (!isLoggedIn) {
      await FirebaseAnalytics.logEvent({
        name: 'click_heart',
        params: {
          login: 'No',
          screen_name: 'main',
          heart_status: 'Inactive',
          post_id: id,
          post_title: title,
          p_user_id: user.id,
        },
      });

      return;
    }

    try {
      await likeTour(id);
      const response = await getTourList(region.countryCode.toUpperCase(), lang);

      setList(response.data.tourList);
    } catch (error) {
      await getNewToken();
      await likeTour(id);
      const response = await getTourList(region.countryCode.toUpperCase(), lang);

      setList(response.data.tourList);

      console.error(error);
    } finally {
      await FirebaseAnalytics.logEvent({
        name: 'click_heart',
        params: {
          login: 'Yes',
          screnn_name: 'main',
          heart_status: like ? 'Inactive' : 'Active',
          post_id: id,
          post_title: title,
          p_user_id: user.id,
        },
      });
    }
  };

  return (
    <div className="-mr-4">
      {/* title area */}
      <div className="flex flex-col gap-1.5 mb-3 pr-4">
        <StatusChip available={directMessageStatus} />

        <div className="pl-1 flex flex-col gap-0.5 grow-0">
          <div className="flex items-center justify-between">
            <IonText className="break-all font-headline2 text-gray8">{title}</IonText>
            <IonIcon
              icon={like ? HeartFilledIcon : HeartLineRedIcon}
              className="svg-lg shrink-0"
              onClick={async (e) => {
                e.preventDefault();
                await onClickLike(id);
              }}
            />
          </div>

          <div className="flex items-center">
            <IonIcon icon={LocationGrayIcon} className="w-4 h-4 shrink-0 mr-0.5" />
            <IonText className="font-body1 text-gray6">{place.name}</IonText>
            {place.district && <Divider />}
            <IonText className="font-body2 text-gray6">{place.district}</IonText>
          </div>
        </div>
      </div>

      {/* content area */}
      {place.imageInfoList?.length === 1 ? (
        <div className="flex gap-2 h-[140px] pr-4">
          <UserImage {...user} />
          <SingleImage image={place.imageInfoList[0].imageUrl} />
        </div>
      ) : (
        <div className="flex gap-2 h-[140px] w-full overflow-x-scroll pr-4 no-scrollbar">
          <UserImage {...user} />
          <Images images={place.imageInfoList.map((el) => el.imageUrl) ?? []} />
        </div>
      )}
    </div>
  );
};

const Divider = () => {
  return <div className="w-[1px] bg-gray6 h-3 mx-1.5" />;
};

const UserImage = ({ firstName, profileImageUrl }: User) => {
  return (
    <div className="overflow-hidden rounded-xl w-[100px] h-full relative flex justify-center shrink-0">
      <IonImg
        className="w-[100px] h-full object-cover"
        src={AvatarLoading}
        alt="user profile"
        onIonImgDidLoad={(e) => (e.target.src = profileImageUrl)}
      />

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
    <IonImg
      className="object-cover w-full overflow-hidden rounded-xl border-[0.5px] border-gray2"
      src={ImageLoadingLarge}
      alt="place"
      onIonImgDidLoad={(e) => (e.target.src = image)}
    />
  );
};

const Images = ({ images }: { images: string[] }) => {
  return (
    <div className="flex gap-2 w-max">
      {images.map((image, index) => (
        <IonImg
          key={index}
          src={ImageLoading}
          alt={`place-${index}`}
          className="object-cover overflow-hidden w-[140px] h-[140px] rounded-xl border-[0.5px] border-gray2"
          onIonImgDidLoad={(e) => (e.target.src = image)}
        />
      ))}
    </div>
  );
};

export default Home;
