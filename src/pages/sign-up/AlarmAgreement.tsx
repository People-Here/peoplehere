/* eslint-disable @typescript-eslint/no-floating-promises */
/* eslint-disable no-undef */
import { IonContent, IonIcon, IonPage, IonText, createAnimation, useIonRouter } from '@ionic/react';
import { useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';

import BellIcon from '../../assets/svgs/bell.svg';
import { postAlarmAgreement } from '../../api/sign-up';

import type { Animation } from '@ionic/react';

const AlarmAgreement = () => {
  const { t } = useTranslation();

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
  }, [animation]);

  const agreeAlram = async () => {
    try {
      await postAlarmAgreement(true);
      router.push('/login', 'forward', 'replace');
    } catch (error) {
      console.error('Failed to post alarm agreement with error:', error);
    }
  };

  const disagreeAlarm = () => {
    try {
      // await postAlarmAgreement(false);
      router.push('/login', 'forward', 'replace');
    } catch (error) {
      console.error('Failed to post alarm agreement with error:', error);
    }
  };

  return (
    <IonPage>
      <IonContent fullscreen>
        <div className="flex flex-col items-center justify-center w-full h-full gap-16 px-4">
          <div className="flex flex-col items-center">
            <IonIcon
              ref={iconRef}
              icon={BellIcon}
              className="mb-6 w-14 h-14"
              onClick={() => {
                animation.current?.play();
              }}
            />

            <IonText className="font-headline2 text-black mb-1.5">
              {t('signup.alarm.title')}
            </IonText>
            <IonText className="whitespace-pre-line font-body1 text-gray5">
              {t('signup.alarm.description')}
            </IonText>
          </div>

          <div className="flex flex-col items-center w-full gap-4">
            <button className="w-full button-primary button-lg" onClick={agreeAlram}>
              {t('signup.alarm.agree')}
            </button>
            <IonText className="font-body1 text-gray6" onClick={disagreeAlarm}>
              {t('signup.alarm.skip')}
            </IonText>
          </div>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default AlarmAgreement;
