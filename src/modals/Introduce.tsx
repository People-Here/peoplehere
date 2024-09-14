import { useEffect, useState } from 'react';
import { IonText } from '@ionic/react';
import { useTranslation } from 'react-i18next';
import { FirebaseAnalytics } from '@capacitor-community/firebase-analytics';

import { FixedModalContainer } from '.';

import type { FixedModalProps } from '.';

type Props = {
  introduce: string;
  setIntroduce: (value: string) => void;
};

const Introduce = ({ introduce, setIntroduce, ...rest }: FixedModalProps & Props) => {
  const { t } = useTranslation();

  const [input, setInput] = useState('');

  useEffect(() => {
    setInput(introduce);
  }, [introduce]);

  return (
    <FixedModalContainer
      title={t('profile.introduction')}
      buttonText={t('progress.save')}
      onClickButton={async () => {
        await FirebaseAnalytics.logEvent({
          name: 'intruduction_complete',
          params: {},
        });
        setIntroduce(input);
      }}
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
