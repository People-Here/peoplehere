import { useState } from 'react';
import { IonText } from '@ionic/react';

import ModalContainer from '.';

import type { ModalProps } from '.';

type Props = {
  title: string;
  placeholder: string;
  maxLength: number;
  setValue: (value: string) => void;
};

const SimpleInputModal = ({
  title,
  placeholder,
  maxLength,
  setValue,
  ...props
}: Props & ModalProps) => {
  const [input, setInput] = useState('');

  return (
    <ModalContainer
      title={title}
      buttonText="저장"
      initialBreakpoint={0.3}
      breakpoints={[0, 0.3, 0.5]}
      onClickButton={() => setValue(input)}
      {...props}
    >
      <div className="flex flex-col gap-1.5 items-end mb-4 mt-3">
        <input
          className="w-full px-4 py-2.5 rounded-lg bg-gray1.5 font-body1 text-gray8"
          type="text"
          value={input}
          onChange={(e) => setInput(e.currentTarget.value)}
          placeholder={placeholder}
          maxLength={maxLength}
        />

        <IonText className="font-caption2 text-gray5">
          {input.length}/{maxLength}
        </IonText>
      </div>
    </ModalContainer>
  );
};

export default SimpleInputModal;
