import { memo } from 'react';
import { IonIcon, IonText } from '@ionic/react';

import CheckIcon from '../assets/svgs/check.svg';
import CheckGrayIcon from '../assets/svgs/check-gray.svg';
import { PASSWORD_VALIDATION } from '../constants/regex';

type Props = {
  password: string;
};

const PasswordValidator = ({ password }: Props) => {
  const moreThan8 = PASSWORD_VALIDATION.moreThan8.test(password);
  const hasSpecialCharOrNumber = PASSWORD_VALIDATION.hasSpecialCharOrNumber.test(password);

  return (
    <div className="flex flex-col gap-1">
      <div className="flex items-center gap-1">
        <IonIcon icon={moreThan8 ? CheckIcon : CheckGrayIcon} className="svg-md" />
        <IonText
          className={moreThan8 ? 'text-orange5 font-caption2' : 'text-gray5.5 font-caption2'}
        >
          8자리 이상
        </IonText>
      </div>
      <div className="flex items-center gap-1">
        <IonIcon icon={hasSpecialCharOrNumber ? CheckIcon : CheckGrayIcon} className="svg-md" />
        <IonText
          className={
            hasSpecialCharOrNumber ? 'text-orange5 font-caption2' : 'text-gray5.5 font-caption2'
          }
        >
          기호나 숫자를 1자 이상 포함
        </IonText>
      </div>
    </div>
  );
};

export default memo(PasswordValidator);
