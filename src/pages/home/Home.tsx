import { IonIcon, IonImg, IonText } from '@ionic/react';
import { Link } from 'react-router-dom';
import { Fragment, useLayoutEffect, useState } from 'react';

import SearchIcon from '../../assets/svgs/search.svg';
import MessageIcon from '../../assets/svgs/message-line-color.svg';
import MessageBlockedIcon from '../../assets/svgs/message-blocked.svg';
import HeartLineRedIcon from '../../assets/svgs/heart-line-red.svg';
import HeartFilledIcon from '../../assets/svgs/heart-filled.svg';
import useUserStore from '../../stores/userInfo';
import { getTourList } from '../../api/tour';

import type { Place, Tour, User } from '../../api/tour';

const Home = () => {
  const [list, setList] = useState<Tour[]>([]);
  const [loading, setLoading] = useState(true);

  useLayoutEffect(() => {
    setLoading(true);

    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    (async () => {
      const { data, status } = await getTourList();

      if (status === 200) {
        setList(data.tourList);
        setLoading(false);
        return;
      }

      setLoading(false);
    })();
  }, []);

  if (loading) {
    return <>Loading...</>;
  }

  return (
    <div className="px-4 mt-3">
      <SearchBar />

      <div className="flex flex-col mt-6 gap-7">
        {list.map((tour) => (
          <Fragment key={tour.id}>
            <TourItem
              id={tour.id}
              title={tour.title}
              categoryList={tour.categoryList}
              like={tour.like}
              place={tour.placeInfo}
              user={tour.userInfo}
            />
          </Fragment>
        ))}
      </div>
    </div>
  );
};

const SearchBar = () => {
  const { region } = useUserStore((state) => state);

  return (
    <Link to="/search">
      <div className="w-full h-16 flex items-center pl-6 pr-5 justify-between bg-gray1 rounded-[30px]">
        <div className="flex flex-col">
          <IonText className="font-headline3 text-gray7">어디서 만날까요?</IonText>
          <IonText className="font-caption2 text-gray5">{region.CountryNameKR}</IonText>
        </div>

        <IonIcon icon={SearchIcon} className="svg-lg" />
      </div>
    </Link>
  );
};

const StatusChip = ({ available }: { available?: boolean }) => {
  return available ? (
    <div className="flex items-center gap-[5px] px-2 py-1 bg-orange1 rounded-[10px] w-fit">
      <IonText className="font-caption1 text-orange5">말 걸 수 있음</IonText>
      <IonIcon icon={MessageIcon} className="svg-sm" />
    </div>
  ) : (
    <div className="flex items-center gap-[5px] px-2 py-1 bg-gray1.5 rounded-[10px] w-fit">
      <IonText className="font-caption1 text-gray6">쪽지 마감</IonText>
      <IonIcon icon={MessageBlockedIcon} className="svg-sm" />
    </div>
  );
};

type TourItemProps = {
  place: Place;
  user: User;
};

const TourItem = ({
  title,
  like,
  place,
  user,
}: Omit<Tour, 'placeInfo' | 'userInfo'> & TourItemProps) => {
  return (
    <div className="-mr-4">
      {/* title area */}
      <div className="flex flex-col gap-1.5 mb-3 pr-4">
        <StatusChip available />

        <div className="pl-1 flex flex-col gap-0.5">
          <div className="flex items-center justify-between">
            <IonText className="font-headline3 text-gray8">{title}</IonText>
            <IonIcon icon={like ? HeartFilledIcon : HeartLineRedIcon} className="svg-lg" />
          </div>

          <div className="flex items-center">
            <IonText className="font-caption1 text-gray6">{place.name}</IonText>
            <Divider />
            <IonText className="font-caption2 text-gray6">{place.district}</IonText>
          </div>
        </div>
      </div>

      {/* content area */}
      {place.imageUrlList?.length === 1 ? (
        <div className="flex gap-2 h-[140px]">
          <UserImage {...user} />
          <SingleImage image={place.imageUrlList[0].imageUrl} />
        </div>
      ) : (
        <div className="flex gap-2 h-[140px] w-full overflow-x-scroll pr-4">
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
