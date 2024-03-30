import { IonIcon, IonText } from '@ionic/react';

import useRegionStore from '../../stores/user';
import SearchIcon from '../../assets/svgs/search.svg';

const Home = () => {
  return (
    <div>
      <SearchBar />
    </div>
  );
};

const SearchBar = () => {
  const region = useRegionStore((state) => state.region);

  return (
    <div className="w-full h-16 flex items-center pl-6 pr-5 justify-between bg-gray1 rounded-[30px]">
      <div>
        <IonText className="font-headline3 text-gray7">어디서 만날까요?</IonText>
        <IonText>{region.CountryNameKR}</IonText>
      </div>

      <IonIcon icon={SearchIcon} className="svg-lg" />
    </div>
  );
};

const Item = () => {
  return <div></div>;
};

export default Home;
