import { useState } from 'react';
import { IonCheckbox, IonText } from '@ionic/react';

import ModalContainer from '.';
import colors from '../theme/colors';
import { useAppStore } from '../stores';

import type { ModalProps } from '.';

type Props = {
  age: string;
};

const ShowAge = ({ age, ...rest }: ModalProps & Props) => {
  const setShowAge = useAppStore((state) => state.setShowAge);

  const [show, setShow] = useState(false);

  return (
    <ModalContainer
      title="출생연도 공개 여부를 선택하세요"
      buttonText="저장"
      initialBreakpoint={0.35}
      breakpoints={[0, 0.35, 0.5]}
      onClickButton={() => setShowAge(show)}
      {...rest}
    >
      <div className="px-4 py-2.5 w-full rounded-lg bg-gray1.5">
        <IonText className="font-body1 text-gray8">{age}</IonText>
      </div>

      <div className="flex flex-col px-1 mt-8 mb-3">
        <IonCheckbox
          class="ion-no-margin"
          justify="space-between"
          checked={show}
          onIonChange={(e) => setShow(e.detail.checked)}
          style={{
            '--size': '18px',
            '--checkbox-background': colors.gray3,
            '--checkbox-background-checked': colors.orange5,
            '--border-width': 0,
          }}
        >
          <IonText className="font-body1 text-gray5.5">출생연도를 공개할까요?</IonText>
        </IonCheckbox>
      </div>
    </ModalContainer>
  );
};

export default ShowAge;
