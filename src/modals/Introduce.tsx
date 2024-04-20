import { useState } from 'react';
import { IonText } from '@ionic/react';

import ModalContainer from '.';
import { useAppStore } from '../stores';

import type { ModalProps } from '.';

const Introduce = (props: ModalProps) => {
  const setIntroduce = useAppStore((state) => state.setIntroduce);

  const [input, setInput] = useState('');

  return (
    <ModalContainer
      title="자기 소개"
      buttonText="저장"
      initialBreakpoint={0.9}
      breakpoints={[0, 0.45, 0.9]}
      onWillDismiss={() => setIntroduce(input)}
      {...props}
    >
      <div className="flex flex-col gap-1.5 items-end mb-5">
        <textarea
          className="px-4 py-2.5 rounded-lg bg-gray1.5 h-[8.75rem] w-full font-body1 text-gray8"
          value={input}
          onChange={(e) => setInput(e.currentTarget.value)}
          maxLength={450}
        />

        <IonText className="font-caption2 text-gray5">{input.length}/450</IonText>
      </div>
    </ModalContainer>
  );
};

export default Introduce;
