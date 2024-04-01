/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { IonIcon, IonItem, IonList, IonText } from '@ionic/react';
import { useState } from 'react';

import CheckIcon from '../assets/svgs/check.svg';
import ModalContainer from '.';

const genders = ['여성', '남성', '선택안함'];

type Props = {
  trigger: string;
  setGender: (value: string) => void;
};

const SelectGender = ({ trigger, setGender }: Props) => {
  const [selectedGender, setSelectedGender] = useState('');

  return (
    <ModalContainer
      trigger={trigger}
      title="성별을 선택하세요"
      buttonText="확인"
      initialBreakpoint={0.4}
      breakpoints={[0, 0.4]}
      onWillDismiss={() => setGender(selectedGender)}
    >
      <IonList onClick={(event: any) => setSelectedGender(event.target.innerText as string)}>
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
    </ModalContainer>
  );
};

export default SelectGender;
