import { IonDatetime } from '@ionic/react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import ModalContainer from '.';

import type { ModalProps } from '.';

type Props = {
  date?: string;
  setDate: (date: string) => void;
};

const DatePicker = ({ date, setDate, ...rest }: Props & ModalProps) => {
  const { t } = useTranslation();

  const [selectedDate, setSelectedDate] = useState(date ?? new Date().toISOString());

  return (
    <ModalContainer
      title={t('signup.info.selectBirthDay')}
      buttonText={t('common.confirm')}
      initialBreakpoint={0.45}
      breakpoints={[0, 0.45]}
      onWillDismiss={() => setDate(selectedDate)}
      {...rest}
    >
      <IonDatetime
        preferWheel
        presentation="date"
        locale="KO"
        value={selectedDate}
        onIonChange={(event) => {
          setSelectedDate(event.detail.value as string);
        }}
        style={{
          '--background': '#fff',
          '--background-rgb': '255, 255, 255',
        }}
      />
    </ModalContainer>
  );
};

export default DatePicker;
