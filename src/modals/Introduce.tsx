import { useState } from 'react';
import { IonText } from '@ionic/react';

import { FixedModalContainer } from '.';

import type { FixedModalProps } from '.';

type Props = {
  introduce: string;
  setIntroduce: (value: string) => void;
};

const Introduce = ({ introduce, setIntroduce, ...rest }: FixedModalProps & Props) => {
  const [input, setInput] = useState('');

  return (
    <FixedModalContainer
      title="자기 소개를 작성하세요"
      buttonText="저장"
      onDismiss={() => setIntroduce(input)}
      onPresent={() => setInput(introduce)}
      {...rest}
    >
      <div className="flex flex-col gap-1.5 items-end mb-5 mt-3 h-screen">
        <textarea
          className="px-4 py-2.5 rounded-lg bg-gray1.5 h-[8.75rem] w-full font-body1 text-gray8"
          value={input}
          onChange={(e) => setInput(e.currentTarget.value)}
          maxLength={450}
        />

        <IonText className="font-caption2 text-gray5">{input?.length ?? 0}/450</IonText>
      </div>
    </FixedModalContainer>
  );
};

export default Introduce;
