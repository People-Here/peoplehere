/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { IonIcon, IonList } from '@ionic/react';
import { useLayoutEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import CheckIcon from '../assets/svgs/check.svg';
import { FixedModalContainer } from '.';
import { getAllGenders } from '../api/constants';
import { GENDER } from '../constants/gender';
import { capitalizeFirstLetter } from '../utils/mask';

import type { FixedModalProps } from '.';

type Props = {
  setGender: (value: string) => void;
};

const SelectGender = ({ setGender, onClickButton, ...rest }: FixedModalProps & Props) => {
  const { t, i18n } = useTranslation();

  const [selectedGender, setSelectedGender] = useState('');
  const [genders, setGenders] = useState<string[]>([]);

  useLayoutEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    (async () => {
      const response = await getAllGenders();

      if (response.status === 200) {
        setGenders(response.data);
      }
    })();
  }, []);

  return (
    <FixedModalContainer
      title={t('signup.info.selectGender')}
      buttonText={t('common.confirm')}
      onClickButton={() => {
        setGender(selectedGender);
        onClickButton?.();
      }}
      {...rest}
    >
      <IonList>
        {genders.map((gender) => (
          <div
            className="py-4 px-3 border-b border-gray1.5 w-full flex justify-between items-center"
            key={gender}
            onClick={() => setSelectedGender(gender)}
          >
            <p
              className={
                gender === selectedGender ? 'font-body1 text-orange5' : 'font-body1 text-gray8'
              }
            >
              {i18n.resolvedLanguage === 'ko'
                ? GENDER[gender as keyof typeof GENDER]
                : capitalizeFirstLetter(gender)}
            </p>
            {gender === selectedGender && <IonIcon className="svg-md" slot="end" src={CheckIcon} />}
          </div>
        ))}
      </IonList>
    </FixedModalContainer>
  );
};

export default SelectGender;
