import {
  IonIcon,
  IonImg,
  IonRefresher,
  IonRefresherContent,
  IonText,
  useIonRouter,
} from '@ionic/react';
import { Link, useLocation } from 'react-router-dom';
import { useLayoutEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

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

import type { RefresherEventDetail } from '@ionic/react';
import type { Place, Tour, User } from '../../api/tour';

const Home = () => {
  const { t } = useTranslation();

  const router = useIonRouter();
  const location = useLocation();

  const [list, setList] = useState<Tour[]>([]);
  const [loading, setLoading] = useState(true);

  const region = useSignInStore((state) => state.region);

  useLayoutEffect(() => {
    setLoading(true);

    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    (async () => {
      const lang = await getTranslateLanguage();

      if (location.search) {
        const keyword = location.search.split('=')[1];

        const { data, status } = await searchTour(keyword, region.countryCode.toUpperCase(), lang);

        if (status === 200) {
          setList(data.tourList);
        }
      } else {
        try {
          const response = await getTourList(region.countryCode.toUpperCase(), lang);

          setList(response.data.tourList);
        } catch (error) {
          await getNewToken();

          const { data } = await getTourList(region.countryCode.toUpperCase(), lang);
          setList(data.tourList);
        }
      }

      setLoading(false);
    })();
  }, [location.search, region.countryCode]);

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

  if (loading) {
    return <LogoRunning />;
  }

  return (
    <div className="px-4 mt-3">
      <SearchBar />

      <IonRefresher slot="fixed" onIonRefresh={handleRefresh}>
        <IonRefresherContent />
      </IonRefresher>
      <div className="flex flex-col pb-20 mt-6 gap-7">
        {list.length === 0 ? (
          <div className="mt-60">
            <div className="flex flex-col items-center gap-8">
              <IonIcon icon={EmptyListIcon} className="w-[67px] h-[53px]" />

              <IonText className="font-headline3 text-gray5.5">{t('searchBar.noResults')}</IonText>
            </div>
          </div>
        ) : (
          <>
            {list.map((tour) => (
              <Link key={tour.id} to={`/tour/${tour.id}`}>
                <TourItem
                  id={tour.id}
                  title={tour.title}
                  categoryList={tour.categoryList}
                  like={tour.like}
                  place={tour.placeInfo}
                  user={tour.userInfo}
                  setList={setList}
                />
              </Link>
            ))}
          </>
        )}
      </div>

      <SearchPlace
        trigger="search-modal"
        onClickItem={(item) => router.push(`/home?search=${item.title}`)}
      />
    </div>
  );
};

const SearchBar = () => {
  const { t } = useTranslation();
  const location = useLocation();

  const { region } = useSignInStore((state) => state);

  return (
    <div id="search-modal" className="w-full">
      <div className="w-full h-16 flex items-center pl-6 pr-5 justify-between bg-gray1 rounded-[30px]">
        <div className="flex flex-col">
          <IonText className="font-headline3 text-gray7">{t(`searchBar.title`)}</IonText>
          <IonText className="font-caption2 text-gray5">
            {location.search ? location.search.split('=')[1] : region.koreanName}
          </IonText>
        </div>

        <IonIcon icon={SearchIcon} className="svg-lg" />
      </div>
    </div>
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
}: Omit<Tour, 'placeInfo' | 'userInfo'> & TourItemProps) => {
  const { checkLogin } = useLogin();

  const onClickLike = async (id: string) => {
    if (!checkLogin()) return;

    try {
      await likeTour(id);
      const response = await getTourList('KR', 'ORIGIN');

      setList(response.data.tourList);
    } catch (error) {
      await getNewToken();
      await likeTour(id);
      const response = await getTourList('KR', 'ORIGIN');

      setList(response.data.tourList);

      console.error(error);
    }
  };

  return (
    <div className="-mr-4">
      {/* title area */}
      <div className="flex flex-col gap-1.5 mb-3 pr-4">
        <StatusChip available />

        <div className="pl-1 flex flex-col gap-0.5">
          <div className="flex items-center justify-between">
            <IonText className="font-headline3 text-gray8">{title}</IonText>
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
            <IonText className="font-caption1 text-gray6">{place.name}</IonText>
            {place.district && <Divider />}
            <IonText className="font-caption2 text-gray6">{place.district}</IonText>
          </div>
        </div>
      </div>

      {/* content area */}
      {place.imageUrlList?.length === 1 ? (
        <div className="flex gap-2 h-[140px] pr-4">
          <UserImage {...user} />
          <SingleImage image={place.imageUrlList[0].imageUrl} />
        </div>
      ) : (
        <div className="flex gap-2 h-[140px] w-full overflow-x-scroll pr-4 no-scrollbar">
          <UserImage {...user} />
          <Images images={place.imageUrlList.map((el) => el.imageUrl) ?? []} />
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

const Images = ({ images }: { images: string[] }) => {
  return (
    <div className="flex gap-2 w-max">
      {images.map((image, index) => (
        <IonImg
          key={index}
          src={image}
          alt={`place-${index}`}
          className="object-cover overflow-hidden w-[140px] h-[140px] rounded-xl"
        />
      ))}
    </div>
  );
};

export default Home;
