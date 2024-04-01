import { IonDatetime } from '@ionic/react';
import { useState } from 'react';

import ModalContainer from '.';

type Props = {
  trigger: string;
  date?: string;
  setDate: (date: string) => void;
};

const DatePicker = ({ trigger, date, setDate }: Props) => {
  const [selectedDate, setSelectedDate] = useState('');

  return (
    <ModalContainer
      title="생년월일을 입력해주세요"
      buttonText="확인"
      trigger={trigger}
      initialBreakpoint={0.45}
      breakpoints={[0, 0.45]}
      onWillDismiss={() => setDate(selectedDate)}
    >
      <IonDatetime
        preferWheel
        presentation="date"
        locale="KO"
        defaultValue={date}
        onIonChange={(event) => {
          setSelectedDate(event.detail.value as string);
        }}
      />
    </ModalContainer>
  );
};

export default DatePicker;
