import { IonInput, IonItem, IonText } from '@ionic/react';
import { memo } from 'react';

import type { ComponentProps } from 'react';

type Props = {
  label: string;
  value: string;
  onChange: (input: string) => void;
  type?: ComponentProps<typeof IonInput>['type'];
  readonly?: boolean;
  errorText?: string;
};

const LabelInput = ({ label, value, onChange, type, readonly, errorText }: Props) => {
  return (
    <>
      <IonItem
        className="h-[54px] w-full"
        lines="none"
        style={{
          '--background': '#F4F5F7',
          '--border-radius': '12px',
          '--border-width': 0,
        }}
      >
        <IonInput
          className="font-body1 text-gray8"
          type={type}
          label={label}
          labelPlacement="floating"
          value={value}
          onIonInput={(e) => onChange(e.target.value as string)}
          readonly={readonly}
          style={{
            '--highlight-color-focused': '#9FA4A9',
          }}
        />
      </IonItem>

      {errorText ? <IonText className="pl-1 font-caption2 text-red3">{errorText}</IonText> : null}
    </>
  );
};

export default memo(LabelInput);
