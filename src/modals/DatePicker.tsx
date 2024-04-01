import { IonDatetime } from '@ionic/react';
import { useState } from 'react';

import ModalContainer from '.';

type Props = {
  date?: string;
  setDate: (date: string) => void;
  closeModal: () => void;
};

const DatePicker = ({ date, setDate, closeModal }: Props) => {
  const [selectedDate, setSelectedDate] = useState('');

  return (
    <ModalContainer title="생년월일을 입력해주세요" closeModal={closeModal}>
      <IonDatetime
        preferWheel
        presentation="date"
        locale="KO"
        defaultValue={date}
        onIonChange={(event) => {
          setSelectedDate(event.detail.value as string);
        }}
      />

      <button
        className="w-full button-primary button-lg mt-7"
        onClick={() => {
          setDate(selectedDate);
          closeModal();
        }}
      >
        확인
      </button>
    </ModalContainer>
  );
};

export default DatePicker;
