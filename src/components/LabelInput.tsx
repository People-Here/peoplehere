import { IonInput, IonItem, IonText } from '@ionic/react';
import { memo } from 'react';

import type { ComponentProps } from 'react';

type Props = {
  label: string;
  value: string;
  onChange: (input: string) => void;
  onBlur?: () => void;
  type?: ComponentProps<typeof IonInput>['type'];
  readonly?: boolean;
  errorText?: string;
  inputMode?: ComponentProps<typeof IonInput>['inputMode'];
};

const LabelInput = ({
  label,
  value,
  onChange,
  onBlur,
  type,
  readonly,
  errorText,
  inputMode,
}: Props) => {
  return (
    <div className="w-full">
      <IonItem
        className="w-full h-full"
        lines="none"
        style={{
          '--background': '#F4F5F7',
          '--border-radius': '12px',
          '--border-width': 0,
        }}
      >
        <IonInput
          className="w-full font-body1 text-gray8 -mb-0.5"
          type={type}
          label={label}
          inputMode={inputMode}
          labelPlacement="floating"
          value={value}
          onIonInput={(e) => onChange(e.target.value as string)}
          onIonBlur={onBlur}
          readonly={readonly}
          style={{
            '--highlight-color-focused': '#9FA4A9',
          }}
        />
      </IonItem>

      {errorText ? <IonText className="pl-1 font-caption2 text-red3">{errorText}</IonText> : null}
    </div>
  );
};

export default memo(LabelInput);
