import { useState } from 'react';
import { IonLabel, IonText } from '@ionic/react';

import ModalContainer from '.';
import Checkbox from '../components/Checkbox';

import type { ModalProps } from '.';

type Props = {
  age: string;
  setShowAge: (value: boolean) => void;
};

const ShowAge = ({ age, setShowAge, ...props }: ModalProps & Props) => {
  const [show, setShow] = useState(false);

  return (
    <ModalContainer
      title="출생연도 공개 여부를 선택하세요"
      buttonText="저장"
      initialBreakpoint={0.35}
      breakpoints={[0, 0.35, 0.5]}
      onClickButton={() => setShowAge(show)}
      {...props}
    >
      <div className="px-4 py-2.5 w-full rounded-lg bg-gray1.5 mt-4">
        <IonText className="font-body1 text-gray8">{age}</IonText>
      </div>

      <div className="px-1 mt-8 mb-3">
        <Checkbox
          checked={show}
          onChange={setShow}
          label={<IonLabel className="font-body1 text-gray5.5">출생연도를 공개할까요?</IonLabel>}
        />
      </div>
    </ModalContainer>
  );
};

export default ShowAge;
