import { IonIcon, IonInput, IonItem } from '@ionic/react';

import EyeClosedIcon from '../assets/svgs/eye-closed.svg';
import EyeOpenIcon from '../assets/svgs/eye-open.svg';
import { useState } from 'react';

type Props = {
  value: string;
  onChange: (input: string) => void;
};

const PasswordInput = ({ value, onChange }: Props) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <IonItem
      className="h-[54px]"
      style={{
        '--background': '#F4F5F7',
        '--border-radius': '12px',
        '--border-width': 0,
      }}
      lines="none"
    >
      <IonInput
        className="p-0 font-body1 text-gray8"
        label="비밀번호"
        labelPlacement="floating"
        value={value}
        onIonInput={(e) => onChange(e.target.value as string)}
        type={showPassword ? 'text' : 'password'}
        style={{
          '--highlight-color-focused': '#9FA4A9',
        }}
      />
      <IonIcon
        slot="end"
        icon={showPassword ? EyeOpenIcon : EyeClosedIcon}
        onClick={() => setShowPassword((prev) => !prev)}
      />
    </IonItem>
  );
};

export default PasswordInput;
