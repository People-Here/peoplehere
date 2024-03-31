import { IonIcon, IonImg, IonText } from '@ionic/react';

import useRegionStore from '../../stores/user';
import SearchIcon from '../../assets/svgs/search.svg';
import MessageIcon from '../../assets/svgs/message.svg';
import HeartLineRedIcon from '../../assets/svgs/heart-line-red.svg';
import SampleUserImage from '../../assets/images/sample-user.png';
import SamplePlaceImage from '../../assets/images/sample-place3.png';
import SamplePlaceImage2 from '../../assets/images/sample-place2.png';
import SamplePlaceImage3 from '../../assets/images/sample-place1.png';

const Home = () => {
  return (
    <div className="px-4 mt-3">
      <SearchBar />

      <div className="flex flex-col mt-6 gap-7">
        <Item />
        <Item2 />
        <Item2 />
        <Item2 />
      </div>
    </div>
  );
};

const SearchBar = () => {
  const region = useRegionStore((state) => state.region);

  return (
    <div className="w-full h-16 flex items-center pl-6 pr-5 justify-between bg-gray1 rounded-[30px]">
      <div className="flex flex-col">
        <IonText className="font-headline3 text-gray7">어디서 만날까요?</IonText>
        <IonText className="font-caption2 text-gray5">{region.CountryNameKR}</IonText>
      </div>

      <IonIcon icon={SearchIcon} className="svg-lg" />
    </div>
  );
};

const AvailableChip = ({ available }: { available?: boolean }) => {
  return available ? (
    <div className="flex items-center gap-[5px] px-2 py-1 bg-orange1 rounded-[10px] w-fit">
      <IonText className="font-caption1 text-orange5">말 걸 수 있음</IonText>
      <IonIcon icon={MessageIcon} className="svg-sm" />
    </div>
  ) : (
    <div></div>
  );
};

const Item = () => {
  return (
    <div className="flex flex-col gap-3">
      {/* title area */}
      <div className="flex flex-col gap-1.5">
        <AvailableChip available />
        <div className="pl-1 flex flex-col gap-0.5">
          <div className="flex items-center justify-between">
            <IonText className="font-headline3 text-gray8">송리단길과 석촌호수 산책</IonText>
            <IonIcon icon={HeartLineRedIcon} className="svg-lg" />
          </div>

          <div className="flex items-center">
            <IonText className="font-caption1 text-gray6">석촌호수</IonText>
            <Divider />
            <IonText className="font-caption2 text-gray6">송파구</IonText>
          </div>
        </div>
      </div>

      {/* content area */}
      <div className="flex gap-2 h-[140px]">
        <UserImage />
        <SingleImage />
      </div>
    </div>
  );
};

const Item2 = () => {
  return (
    <div className="-mr-4">
      {/* title area */}
      <div className="flex flex-col gap-1.5 mb-3 pr-4">
        <AvailableChip available />
        <div className="pl-1 flex flex-col gap-0.5">
          <div className="flex items-center justify-between">
            <IonText className="font-headline3 text-gray8">송리단길과 석촌호수 산책</IonText>
            <IonIcon icon={HeartLineRedIcon} className="svg-lg" />
          </div>

          <div className="flex items-center">
            <IonText className="font-caption1 text-gray6">석촌호수</IonText>
            <Divider />
            <IonText className="font-caption2 text-gray6">송파구</IonText>
          </div>
        </div>
      </div>

      {/* content area */}
      <div className="flex gap-2 h-[140px] w-full overflow-x-scroll pr-4">
        <UserImage />
        <Images />
      </div>
    </div>
  );
};

const Divider = () => {
  return <div className="w-[1px] bg-gray6 h-3 mx-1.5" />;
};

const UserImage = () => {
  return (
    <div className="overflow-hidden rounded-xl w-[100px] h-full relative flex justify-center shrink-0">
      <IonImg className="w-[100px] h-full object-cover" src={SampleUserImage} alt="user profile" />

      <div
        className="h-[72px] absolute bottom-0 left-0 right-0"
        style={{
          background: 'linear-gradient(180deg, rgba(27, 29, 31, 0.00) 0%, #1B1D1F 100%)',
        }}
      ></div>
      <IonText className="absolute bottom-3 font-body1 text-gray2">Rachel</IonText>
    </div>
  );
};

const SingleImage = () => {
  return (
    <IonImg
      className="object-cover w-full overflow-hidden rounded-xl"
      src={SamplePlaceImage}
      alt="place"
    />
  );
};

const Images = () => {
  const images = [SamplePlaceImage, SamplePlaceImage2, SamplePlaceImage3];

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
