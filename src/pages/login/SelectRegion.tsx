import { IonIcon, IonInput, IonItem, IonLabel, IonList, IonText } from '@ionic/react';
import { memo, useEffect, useState } from 'react';

import CloseIcon from '../../assets/svgs/close.svg';
import allRegions from '../../constants/region';

const SelectRegion = () => {
  const [searchText, setSearchText] = useState('');
  const [regions, setRegions] = useState(() =>
    allRegions.map((region) => {
      return {
        digitCode: region['2digitCode'],
        numericCode: region.ISONumbericCode,
        nameKR: region.CountryNameKR,
        nameEN: region.CountryNameEN,
      };
    }),
  );

  useEffect(() => {
    const timer = setTimeout(() => {
      filterCountries(searchText);
    }, 500);

    return () => {
      clearTimeout(timer);
    };
  }, [searchText]);

  const filterCountries = (keyword: string) => {
    const filtered = allRegions
      .filter(
        (region) =>
          region.CountryNameKR.includes(keyword) ||
          region.CountryNameEN.toLowerCase().includes(keyword.toLowerCase()),
      )
      .map((region) => {
        return {
          digitCode: region['2digitCode'],
          numericCode: region.ISONumbericCode,
          nameKR: region.CountryNameKR,
          nameEN: region.CountryNameEN,
        };
      });

    setRegions(filtered);
  };

  return (
    <div className="relative p-4 pt-10">
      <IonIcon className="absolute svg-lg stroke-gray7 top-4 right-4" src={CloseIcon} />

      <IonText className="font-headline2 text-gray8">출신 국가를 선택하세요</IonText>

      <div className="h-11 bg-gray1.5 rounded-lg px-4 w-full justify-between items-center flex my-4">
        <IonInput
          className="font-body1 text-gray5"
          placeholder="국가 이름"
          value={searchText}
          onIonInput={(e) => setSearchText(e.target.value as string)}
        />
      </div>

      <IonList lines="full">
        {regions.map((region) => (
          <IonItem>
            <IonLabel>{region.nameKR}</IonLabel>
          </IonItem>
        ))}
      </IonList>
    </div>
  );
};

export default memo(SelectRegion);
