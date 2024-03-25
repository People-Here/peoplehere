import { IonInput, IonItem, IonLabel } from '@ionic/react';

type Props = {
  label: string;
  value: string;
  onChange: (value: string) => void;
};

const LabelInput = ({ label, value, onChange }: Props) => {
  return (
    <IonItem>
      <IonLabel position="floating">{label}</IonLabel>
      <IonInput value={value} onIonInput={(event) => onChange(event.target.value as string)} />
    </IonItem>
  );
};

export default LabelInput;
