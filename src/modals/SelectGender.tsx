/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { IonIcon, IonItem, IonList, IonText } from '@ionic/react';
import { useLayoutEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import CheckIcon from '../assets/svgs/check.svg';
import ModalContainer from '.';
import { getAllGenders } from '../api/constants';
import { GENDER } from '../constants/gender';

import type { ModalProps } from '.';

type Props = {
  setGender: (value: string) => void;
};

const SelectGender = ({ setGender, ...rest }: ModalProps & Props) => {
  const { t } = useTranslation();

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
    <ModalContainer
      title={t('signup.info.selectGender')}
      buttonText={t('common.confirm')}
      initialBreakpoint={0.37}
      breakpoints={[0, 0.37, 0.5]}
      onWillDismiss={() => setGender(selectedGender)}
      {...rest}
    >
      <IonList>
        {genders.map((gender) => (
          <IonItem key={gender} onClick={() => setSelectedGender(gender)}>
            <IonText
              className={
                gender === selectedGender ? 'font-body1 text-orange5' : 'font-body1 text-gray8'
              }
            >
              {GENDER[gender as keyof typeof GENDER]}
            </IonText>
            {gender === selectedGender && <IonIcon className="svg-md" slot="end" src={CheckIcon} />}
          </IonItem>
        ))}
      </IonList>
    </ModalContainer>
  );
};

export default SelectGender;
