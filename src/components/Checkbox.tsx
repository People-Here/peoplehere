import { IonIcon } from '@ionic/react';

import CheckedIcon from '../assets/svgs/checked.svg';
import UnCheckedIcon from '../assets/svgs/unchecked.svg';

import type { ReactNode } from 'react';

type Props = {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label: ReactNode;
};

const Checkbox = ({ checked, onChange, label }: Props) => {
  return (
    <div className="flex items-center justify-between" onClick={() => onChange(!checked)}>
      {label}

      <div>
        <IonIcon className="svg-md" icon={checked ? CheckedIcon : UnCheckedIcon} />
      </div>
    </div>
  );
};

export default Checkbox;
