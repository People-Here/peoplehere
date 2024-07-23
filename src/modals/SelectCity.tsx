import { useEffect, useState } from 'react';
import { IonIcon, IonInput, IonItem, IonList, isPlatform } from '@ionic/react';
import { useTranslation } from 'react-i18next';

import { getCities } from '../api/city';
import CheckIcon from '../assets/svgs/check.svg';
import { FixedModalContainer } from '.';

import type { FixedModalProps } from '.';
import type { CityResponse } from '../api/city';

type Props = {
  onClickItem: (item: CityResponse['cityList'][0]) => void;
};

const SelectCity = ({ onClickItem, ...rest }: FixedModalProps & Props) => {
  const { i18n } = useTranslation();

  const isMobile = isPlatform('iphone') || isPlatform('android');

  const [cities, setCities] = useState<CityResponse['cityList']>([]);
  const [searchText, setSearchText] = useState('');
  const [showResult, setShowResult] = useState(false);
  const [selectedCity, setSelectedCity] = useState<CityResponse['cityList'][0]>({
    id: 0,
    region: '',
    latitude: 0,
    longitude: 0,
    cityInfoList: [
      {
        name: '',
        langCode: '',
      },
      {
        name: '',
        langCode: '',
      },
    ],
  });

  useEffect(() => {
    if (!searchText) {
      setShowResult(false);
    }
  }, [searchText]);

  const onSearch = async (searchText: string) => {
    if (!searchText) return;

    const response = await getCities(searchText);

    if (response.status === 200) {
      setCities(response.data.cityList);
      setShowResult(true);
    }
  };

  const onClickCity = (cityId: number) => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    if (selectedCity.id && selectedCity.id === cityId) {
      setSelectedCity({
        id: 0,
        region: '',
        latitude: 0,
        longitude: 0,
        cityInfoList: [
          {
            name: '',
            langCode: '',
          },
          {
            name: '',
            langCode: '',
          },
        ],
      });
      return;
    }

    const targetCity = cities.find((region) => region.id === cityId);
    if (!targetCity) return;

    setSelectedCity(targetCity);
  };

  return (
    <FixedModalContainer
      title="거주지를 알려주세요"
      buttonText="저장"
      onClickButton={() => onClickItem(selectedCity)}
      buttonDisabled={!selectedCity.id}
      onDismiss={() => {
        setSearchText('');
      }}
      {...rest}
    >
      <div className="h-11 bg-gray1.5 rounded-lg px-4 w-full justify-between items-center flex my-4">
        <IonInput
          className="font-body1 text-gray8"
          placeholder="도시 검색"
          clearInput
          value={searchText}
          onIonInput={(e) => {
            setSearchText(e.target.value as string);
          }}
          onKeyUp={(e) => {
            if (e.key === 'Enter') {
              // eslint-disable-next-line @typescript-eslint/no-floating-promises
              onSearch(searchText);
            }
          }}
        />
      </div>

      <section
        className={isMobile ? 'overflow-y-scroll h-[57vh] mb-4' : 'overflow-y-scroll h-[65vh] mb-4'}
      >
        {showResult && (
          <IonList lines="full">
            {cities.map((city) => (
              <IonItem key={city.id} onClick={() => onClickCity(city.id)}>
                {selectedCity.id === city.id ? (
                  <div className="flex items-center justify-between w-full">
                    <div>
                      <p className="w-full font-body1 text-orange6">
                        {i18n.resolvedLanguage === 'ko'
                          ? city.cityInfoList.filter((info) => info.langCode === 'KOREAN')[0].name
                          : city.cityInfoList.filter((info) => info.langCode === 'ENGLISH')[0].name}
                      </p>
                      <p className="font-caption2 text-orange4 mt-0.5">{city.region}</p>
                    </div>

                    <IonIcon className="svg-md" src={CheckIcon} />
                  </div>
                ) : (
                  <div>
                    <p className="w-full font-body1 text-gray8">
                      {i18n.resolvedLanguage === 'ko'
                        ? city.cityInfoList.filter((info) => info.langCode === 'KOREAN')[0].name
                        : city.cityInfoList.filter((info) => info.langCode === 'ENGLISH')[0].name}
                    </p>
                    <p className="font-caption2 text-gray5 mt-0.5">{city.region}</p>
                  </div>
                )}
              </IonItem>
            ))}
          </IonList>
        )}
      </section>
    </FixedModalContainer>
  );
};

export default SelectCity;
