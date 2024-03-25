import { IonIcon, IonInput, IonItem, IonList, IonText, useIonRouter } from '@ionic/react';
import { useEffect, useState } from 'react';

import CheckIcon from '../assets/svgs/check.svg';
import CloseIcon from '../assets/svgs/close.svg';
import allRegions from '../constants/region';
import Footer from '../layouts/Footer';
import useRegionStore from '../stores/user';

type Props = {
  closeModal: () => void;
};
const SelectRegion = ({ closeModal }: Props) => {
  const setRegion = useRegionStore((state) => state.setRegion);
  const router = useIonRouter();

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
  const [searchText, setSearchText] = useState('');
  const [selectedRegion, setSelectedRegion] = useState('');

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

  const onClickRegion = (event: any) => {
    const targetRegion = allRegions.find(
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      (region) => region.CountryNameKR === event.target.innerText,
    );

    setSelectedRegion(targetRegion?.['2digitCode'] ?? '');
  };

  return (
    <div className="relative p-4 pt-10 mb-28">
      <IonIcon
        className="absolute svg-lg stroke-gray7 top-4 right-4"
        src={CloseIcon}
        onClick={closeModal}
      />

      <IonText className="font-headline2 text-gray8">출신 국가를 선택하세요</IonText>

      <div className="h-11 bg-gray1.5 rounded-lg px-4 w-full justify-between items-center flex my-4">
        <IonInput
          className="font-body1 text-gray8"
          placeholder="국가 이름"
          clearInput
          value={searchText}
          onIonInput={(e) => setSearchText(e.target.value as string)}
        />
      </div>

      <section className="h-[32.5rem] overflow-y-scroll">
        <IonList lines="full" onClick={onClickRegion}>
          {regions.map((region) => (
            <IonItem key={region.digitCode}>
              {selectedRegion === region.digitCode ? (
                <div className="flex items-center justify-between w-full">
                  <p className="font-body1 text-orange6">{region.nameKR}</p>
                  <IonIcon className="svg-md" src={CheckIcon} />
                </div>
              ) : (
                <p className="font-body1 text-gray8">{region.nameKR}</p>
              )}
            </IonItem>
          ))}
        </IonList>
      </section>

      <Footer bottom={9}>
        <button
          className="w-full button-primary button-lg"
          disabled={!selectedRegion}
          onClick={() => {
            setRegion(selectedRegion);
            router.push('/');
          }}
        >
          선택
        </button>
      </Footer>
    </div>
  );
};

export default SelectRegion;
