import { IonDatetime } from '@ionic/react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import { FixedModalContainer } from '.';

import type { FixedModalProps } from '.';

type Props = {
  date?: string;
  setDate: (date: string) => void;
};

const DatePicker = ({ date, setDate, ...rest }: Props & FixedModalProps) => {
  const { t, i18n } = useTranslation();

  const [selectedDate, setSelectedDate] = useState(date ?? new Date().toISOString());

  return (
    // <ModalContainer
    //   title={t('signup.info.selectBirthDay')}
    //   buttonText={t('common.confirm')}
    //   initialBreakpoint={0.45}
    //   breakpoints={[0, 0.45]}
    //   onWillDismiss={() => setDate(selectedDate)}
    //   {...rest}
    // >
    //   <IonDatetime
    //     preferWheel
    //     presentation="date"
    //     locale={i18n.resolvedLanguage}
    //     value={selectedDate}
    //     onIonChange={(event) => {
    //       setSelectedDate(event.detail.value as string);
    //     }}
    //     style={{
    //       '--background': '#fff',
    //       '--background-rgb': '255, 255, 255',
    //     }}
    //   />
    // </ModalContainer>
    <FixedModalContainer
      title={t('signup.info.selectBirthDay')}
      buttonText={t('common.confirm')}
      onDismiss={() => setDate(selectedDate)}
      {...rest}
    >
      <IonDatetime
        preferWheel
        presentation="date"
        locale={i18n.resolvedLanguage}
        value={selectedDate}
        onIonChange={(event) => {
          setSelectedDate(event.detail.value as string);
        }}
        style={{
          '--background': '#fff',
          '--background-rgb': '255, 255, 255',
        }}
      />
    </FixedModalContainer>
  );
};

export default DatePicker;
