import { IonInput, IonItem } from '@ionic/react';
import { ComponentProps, memo } from 'react';

type Props = {
  label: string;
  value: string;
  onChange: (input: string) => void;
  type?: ComponentProps<typeof IonInput>['type'];
};

const LabelInput = ({ label, value, onChange, type }: Props) => {
  return (
    <IonItem
      className="h-[54px] w-full"
      style={{
        '--background': '#F4F5F7',
        '--border-radius': '12px',
        '--border-width': 0,
      }}
      lines="none"
    >
      <IonInput
        className="font-body1 text-gray8"
        type={type}
        label={label}
        labelPlacement="floating"
        value={value}
        onIonInput={(e) => onChange(e.target.value as string)}
        style={{
          '--highlight-color-focused': '#9FA4A9',
        }}
      />
    </IonItem>
  );
};

export default memo(LabelInput);
