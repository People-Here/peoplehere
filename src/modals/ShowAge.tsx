import { useState } from 'react';
import { IonLabel, IonText } from '@ionic/react';
import { useTranslation } from 'react-i18next';

import ModalContainer from '.';
import Checkbox from '../components/Checkbox';

import type { ModalProps } from '.';

type Props = {
  age: string;
  showAge: boolean;
  setShowAge: (value: boolean) => void;
};

const ShowAge = ({ age, showAge, setShowAge, ...props }: ModalProps & Props) => {
  const { t } = useTranslation();

  const [show, setShow] = useState(false);

  return (
    <ModalContainer
      title={t('signup.info.showAgeTitle')}
      buttonText={t('common.save')}
      initialBreakpoint={0.35}
      breakpoints={[0, 0.35, 0.5]}
      onClickButton={() => setShowAge(show)}
      onWillPresent={() => setShow(showAge)}
      {...props}
    >
      <div className="px-4 py-2.5 w-full rounded-lg bg-gray1.5 mt-4">
        <IonText className="font-body1 text-gray8">{age}</IonText>
      </div>

      <div className="px-1 mt-8 mb-3">
        <Checkbox
          checked={show}
          onChange={setShow}
          label={
            <IonLabel className="font-body1 text-gray5.5">{t('signup.info.showAge')}</IonLabel>
          }
        />
      </div>
    </ModalContainer>
  );
};

export default ShowAge;
