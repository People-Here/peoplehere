import { IonIcon, IonInput, IonItem } from '@ionic/react';

import ArrowDownIcon from '../assets/svgs/arrow-down.svg';

type Props = {
  label: string;
  value: string;
  openModal: () => void;
};

const SelectInput = ({ label, value, openModal }: Props) => {
  return (
    <IonItem
      className="h-[54px]"
      lines="none"
      onClick={openModal}
      style={{
        '--background': '#F4F5F7',
        '--border-radius': '12px',
        '--border-width': 0,
      }}
    >
      <IonInput
        className="font-body1 text-gray8"
        label={label}
        labelPlacement="floating"
        value={value}
        readonly
        style={{
          '--highlight-color-focused': '#9FA4A9',
          '--padding-bottom': '4px',
        }}
      />
      <IonIcon slot="end" icon={ArrowDownIcon} />
    </IonItem>
  );
};

export default SelectInput;
