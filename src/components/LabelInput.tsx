import { IonInput, IonItem, IonLabel } from '@ionic/react';

type Props = {
  label: string;
  value: string;
  onChange: (input: string) => void;
};

const LabelInput = ({ label, value, onChange }: Props) => {
  return (
    <IonItem
      className="h-[54px] [&_label]:text-gray5"
      style={{
        '--background': '#F4F5F7',
        '--border-radius': '12px',
        '--border-width': 0,
      }}
      lines="none"
    >
      <IonInput
        className="font-body1 text-gray8"
        label={label}
        labelPlacement="floating"
        value={value}
        onIonChange={(e) => onChange(e.target.value as string)}
        style={{
          '--highlight-color-focused': '#9FA4A9',
        }}
      />
    </IonItem>
  );
};

export default LabelInput;
