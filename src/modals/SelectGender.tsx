import { IonIcon, IonItem, IonList, IonText } from '@ionic/react';
import { useState } from 'react';

import CloseIcon from '../assets/svgs/close.svg';
import CheckIcon from '../assets/svgs/check.svg';

const genders = ['여성', '남성', '선택안함'];

type Props = {
  setGender: (value: string) => void;
  closeModal: () => void;
};

const SelectGender = ({ setGender, closeModal }: Props) => {
  const [selectedGender, setSelectedGender] = useState('');

  return (
    <div className="relative p-4 pt-10 mb-28">
      <IonIcon
        className="absolute svg-lg stroke-gray7 top-4 right-4"
        src={CloseIcon}
        onClick={closeModal}
      />

      <IonText className="mb-4 font-headline2 text-gray8">성별을 선택하세요</IonText>

      <IonList onClick={(event: any) => setSelectedGender(event.target.innerText)}>
        {genders.map((gender) => (
          <IonItem key={gender}>
            <IonText
              className={
                gender === selectedGender ? 'font-body1 text-orange5' : 'font-body1 text-gray8'
              }
            >
              {gender}
            </IonText>
            {gender === selectedGender && <IonIcon className="svg-md" slot="end" src={CheckIcon} />}
          </IonItem>
        ))}
      </IonList>

      <button
        className="w-full mt-5 button-primary button-lg"
        onClick={() => {
          setGender(selectedGender);
          closeModal();
        }}
      >
        확인
      </button>
    </div>
  );
};

export default SelectGender;
