import { IonDatetime, IonIcon, IonText } from '@ionic/react';
import { useState } from 'react';

import CloseIcon from '../assets/svgs/close.svg';

type Props = {
  date?: string;
  setDate: (date: string) => void;
  closeModal: () => void;
};

const DatePicker = ({ date, setDate, closeModal }: Props) => {
  const [selectedDate, setSelectedDate] = useState('');

  return (
    <div className="h-1/2">
      <div className="relative p-4 pt-10 mb-28 h-1/2">
        <IonIcon
          className="absolute svg-lg stroke-gray7 top-4 right-4"
          src={CloseIcon}
          onClick={closeModal}
        />

        <IonText className="mb-4 font-headline2 text-gray8">생년월일을 입력해주세요</IonText>

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
      </div>
    </div>
  );
};

export default DatePicker;
