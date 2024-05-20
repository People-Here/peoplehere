import { IonIcon, IonInput, IonItem, IonList, isPlatform } from '@ionic/react';
import { useCallback, useEffect, useLayoutEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import CheckIcon from '../assets/svgs/check.svg';
import useSignInStore from '../stores/signIn';
import ModalContainer from '.';
import { getAllRegions } from '../api/constants';

import type { Region } from '../api/constants';
import type { ModalProps } from '.';

const SelectRegion = (props: ModalProps) => {
  const { t, i18n } = useTranslation();

  const isMobile = isPlatform('iphone') || isPlatform('android');

  const setRegion = useSignInStore((state) => state.setRegion);

  const [regions, setRegions] = useState<Region[]>([]);
  const [filteredRegions, setFilteredRegions] = useState<Region[]>([]);

  console.log('filter', filteredRegions);

  useLayoutEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    (async () => {
      const response = await getAllRegions();

      if (response.status === 200) {
        setRegions(response.data);
        setFilteredRegions(response.data);
      }
    })();
  }, []);

  const [searchText, setSearchText] = useState('');
  const [selectedRegion, setSelectedRegion] = useState<Region>({
    countryCode: '',
    dialCode: 0,
    englishName: '',
    koreanName: '',
  });

  const filterCountries = useCallback(
    (keyword: string) => {
      const filtered = regions.filter(
        (region) =>
          region.koreanName.includes(keyword) ||
          region.englishName.toLowerCase().includes(keyword.toLowerCase()),
      );

      setFilteredRegions(filtered);
    },
    [regions],
  );

  useEffect(() => {
    if (!searchText) {
      setFilteredRegions(regions);
      return;
    }

    const timer = setTimeout(() => {
      filterCountries(searchText);
    }, 500);

    return () => {
      clearTimeout(timer);
    };
  }, [searchText, regions, filterCountries]);

  const onClickRegion = (event: any) => {
    if (selectedRegion.countryCode) {
      setSelectedRegion({
        countryCode: '',
        dialCode: 0,
        englishName: '',
        koreanName: '',
      });
      return;
    }

    const targetRegion = regions.find(
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      (region) => region.koreanName === event.target.innerText,
    );
    if (!targetRegion) return;

    setSelectedRegion(targetRegion);
  };

  return (
    <ModalContainer
      title={t('region.selectRegion')}
      buttonText={t('common.confirm')}
      initialBreakpoint={0.87}
      breakpoints={[0, 0.87, 0.95]}
      onClickButton={() => setRegion(selectedRegion)}
      {...props}
    >
      <div className="h-11 bg-gray1.5 rounded-lg px-4 w-full justify-between items-center flex my-4">
        <IonInput
          className="font-body1 text-gray8"
          placeholder={t('region.placeholder')}
          clearInput
          value={searchText}
          onIonInput={(e) => setSearchText(e.target.value as string)}
        />
      </div>

      <section
        className={isMobile ? 'overflow-y-scroll h-[57vh] mb-4' : 'overflow-y-scroll h-[65vh] mb-4'}
      >
        <IonList lines="full" onClick={onClickRegion}>
          {filteredRegions.map((region) => (
            <IonItem key={region.countryCode}>
              {selectedRegion.countryCode === region.countryCode ? (
                <div className="flex items-center justify-between w-full">
                  <p className="font-body1 text-orange6">
                    {i18n.language[0] === 'ko' ? region.koreanName : region.englishName}
                  </p>
                  <IonIcon className="svg-md" src={CheckIcon} />
                </div>
              ) : (
                <p className="font-body1 text-gray8">{region.koreanName}</p>
              )}
            </IonItem>
          ))}
        </IonList>
      </section>
    </ModalContainer>
  );
};

export default SelectRegion;
