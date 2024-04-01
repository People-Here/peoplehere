import { IonIcon, IonInput, IonItem, IonList } from '@ionic/react';
import { useEffect, useState } from 'react';

import CheckIcon from '../assets/svgs/check.svg';
import allRegions from '../constants/region';
import useRegionStore from '../stores/user';
import ModalContainer from '.';

type Props = {
  closeModal: () => void;
};

const SelectRegion = ({ closeModal }: Props) => {
  const setRegion = useRegionStore((state) => state.setRegion);

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
  const [selectedRegion, setSelectedRegion] = useState({
    '2digitCode': '',
    ISONumbericCode: 0,
    CountryNameKR: '',
    CountryNameEN: '',
  });

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

    if (!targetRegion) return;

    setSelectedRegion({
      '2digitCode': targetRegion['2digitCode'],
      ISONumbericCode: targetRegion.ISONumbericCode,
      CountryNameKR: targetRegion.CountryNameKR,
      CountryNameEN: targetRegion.CountryNameEN,
    });
  };

  return (
    <ModalContainer title="출신 국가를 선택하세요" closeModal={closeModal}>
      <div className="h-11 bg-gray1.5 rounded-lg px-4 w-full justify-between items-center flex my-4">
        <IonInput
          className="font-body1 text-gray8"
          placeholder="국가 이름"
          clearInput
          value={searchText}
          onIonInput={(e) => setSearchText(e.target.value as string)}
        />
      </div>

      <section className="overflow-y-scroll h-[65vh] mb-4">
        <IonList lines="full" onClick={onClickRegion}>
          {regions.map((region) => (
            <IonItem key={region.digitCode}>
              {selectedRegion['2digitCode'] === region.digitCode ? (
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

      <button
        className="w-full button-primary button-lg"
        disabled={!selectedRegion}
        onClick={() => {
          setRegion(selectedRegion);
          closeModal();
        }}
      >
        선택
      </button>
    </ModalContainer>
  );
};

export default SelectRegion;
