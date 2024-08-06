import { useState } from 'react';
import { IonText } from '@ionic/react';
import { useTranslation } from 'react-i18next';

import ModalContainer from '.';

import type { ModalProps } from '.';

type Props = {
  title: string;
  placeholder: string;
  maxLength: number;
  value: string;
  setValue: (value: string) => void;
};

const SimpleInputModal = ({
  title,
  placeholder,
  maxLength,
  value,
  setValue,
  ...props
}: Props & ModalProps) => {
  const { t } = useTranslation();

  const [input, setInput] = useState('');

  return (
    <ModalContainer
      title={title}
      buttonText={t('progress.save')}
      initialBreakpoint={0.3}
      breakpoints={[0, 0.3, 0.5]}
      onClickButton={() => setValue(input)}
      onWillPresent={() => setInput(value)}
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
