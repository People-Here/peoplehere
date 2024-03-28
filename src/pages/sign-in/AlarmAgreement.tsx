import { IonButtons, IonIcon, IonText, createAnimation, useIonRouter } from '@ionic/react';
import type { Animation } from '@ionic/react';

import BellIcon from '../../assets/svgs/bell.svg';
import { useEffect, useRef } from 'react';

const AlarmAgreement = () => {
  const router = useIonRouter();

  const iconRef = useRef<HTMLIonIconElement>(null);
  const animation = useRef<Animation | null>(null);

  useEffect(() => {
    if (!iconRef.current) return;

    animation.current = createAnimation()
      .addElement(iconRef.current)
      .duration(1000)
      .iterations(2)
      .keyframes([
        { offset: 0, rotate: '0deg' },
        { offset: 0.2, rotate: '-10deg' },
        { offset: 0.3, rotate: '10deg' },
        { offset: 0.4, rotate: '-10deg' },
        { offset: 0.5, rotate: '10deg' },
        { offset: 0.6, rotate: '-10deg' },
        { offset: 0.7, rotate: '10deg' },
        { offset: 0.8, rotate: '0deg' },
      ]);
  }, [iconRef]);

  useEffect(() => {
    animation.current?.play();
  }, [animation.current]);

  return (
    <div className="flex flex-col items-center justify-center w-full h-full gap-16 px-4">
      <div className="flex flex-col items-center">
        <IonIcon
          ref={iconRef}
          icon={BellIcon}
          className="mb-6 w-14 h-14"
          onClick={() => animation.current?.play()}
        />

        <IonText className="font-headline2 text-black mb-1.5">알림을 받으시겠어요?</IonText>
        <IonText className="whitespace-pre-line font-body1 text-gray5">
          {'새로운 쪽지, 다가오는 약속 등\n중요한 소식을 놓치지 마세요.'}
        </IonText>
      </div>

      <div className="flex flex-col items-center w-full gap-4">
        <button className="w-full button-primary button-lg" onClick={() => router.push('/')}>
          네, 알림을 받을게요
        </button>
        <IonText className="font-body1 text-gray6" onClick={() => router.push('/')}>
          나중에 설정하기
        </IonText>
      </div>
    </div>
  );
};

export default AlarmAgreement;
