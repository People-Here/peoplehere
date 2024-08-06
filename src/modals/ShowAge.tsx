import { useEffect, useState } from 'react';
import { IonLabel, IonText } from '@ionic/react';
import { useTranslation } from 'react-i18next';

import { FixedModalContainer } from '.';
import Checkbox from '../components/Checkbox';
import { roundAge } from '../utils/mask';

import type { FixedModalProps } from '.';

type Props = {
  age: string;
  showAge: boolean;
  setShowAge: (value: boolean) => void;
};

const ShowAge = ({ age, showAge, setShowAge, ...rest }: FixedModalProps & Props) => {
  const { t, i18n } = useTranslation();

  const [show, setShow] = useState(false);

  useEffect(() => {
    setShow(showAge);
  }, [showAge]);

  return (
    <FixedModalContainer
      title={t('editProfile.decade')}
      buttonText={t('progress.save')}
      onClickButton={() => setShowAge(show)}
      {...rest}
    >
      <div className="px-4 py-2.5 w-full rounded-lg bg-gray1.5 mt-4">
        <IonText className="font-body1 text-gray8">{roundAge(age, i18n.resolvedLanguage)}</IonText>
      </div>

      <div className="px-1 mt-8">
        <Checkbox
          checked={show}
          onChange={setShow}
          label={
            <IonLabel className="font-body1 text-gray5.5">{t('editProfile.showDecade')}</IonLabel>
          }
        />
      </div>
    </FixedModalContainer>
  );
};

export default ShowAge;
