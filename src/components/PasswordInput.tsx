import { IonIcon, IonInput, IonItem } from '@ionic/react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import EyeClosedIcon from '../assets/svgs/eye-closed.svg';
import EyeOpenIcon from '../assets/svgs/eye-open.svg';

type Props = {
  value: string;
  onChange: (input: string) => void;
};

const PasswordInput = ({ value, onChange }: Props) => {
  const { t } = useTranslation();

  const [showPassword, setShowPassword] = useState(false);

  const scrollToBottom = async () => {
    // eslint-disable-next-line no-undef
    const content = document.querySelector('ion-content');

    await content?.scrollToBottom(300);
  };

  return (
    <IonItem
      className="w-full h-full"
      style={{
        '--background': '#F4F5F7',
        '--border-radius': '12px',
        '--border-width': 0,
      }}
      lines="none"
    >
      <IonInput
        className="p-0 font-body1 text-gray8 -mb-0.5"
        label={t('user.password')}
        labelPlacement="floating"
        value={value}
        onIonInput={(e) => onChange(e.target.value as string)}
        onIonFocus={scrollToBottom}
        type={showPassword ? 'text' : 'password'}
        style={{
          '--highlight-color-focused': '#9FA4A9',
        }}
      />
      <IonIcon
        slot="end"
        icon={showPassword ? EyeOpenIcon : EyeClosedIcon}
        onMouseDown={(e) => e.preventDefault()}
        onClick={() => {
          setShowPassword((prev) => !prev);
        }}
      />
    </IonItem>
  );
};

export default PasswordInput;
