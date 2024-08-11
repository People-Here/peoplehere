/* eslint-disable @typescript-eslint/no-floating-promises */
/* eslint-disable no-undef */
import { IonContent, IonIcon, IonPage, IonText, createAnimation, useIonRouter } from '@ionic/react';
import { useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { FirebaseAnalytics } from '@capacitor-community/firebase-analytics';

import BellIcon from '../../assets/svgs/bell.svg';
import { signUp } from '../../api/sign-up';
import useSignInStore from '../../stores/signIn';
import { formatDataToString } from '../../utils/date';
import useLogin from '../../hooks/useLogin';

import type { SignInRequest } from '../../api/sign-up';
import type { Animation } from '@ionic/react';

const AlarmAgreement = () => {
  const { t } = useTranslation();

  const router = useIonRouter();
  const {
    firstName,
    lastName,
    birthDate,
    email,
    gender,
    password,
    region,
    phoneNumber,
    policyConsent,
  } = useSignInStore((state) => state);

  const { requestLogin } = useLogin();

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

  useEffect(() => {
    FirebaseAnalytics.setScreenName({
      screenName: 'notification_onboarding',
    });
  }, []);

  const generateSignInData = (alarm: boolean): SignInRequest => {
    return {
      firstName,
      lastName,
      birthDate: formatDataToString(birthDate),
      email,
      gender,
      password,
      region: region.countryCode,
      phoneNumber,
      privacyConsent: policyConsent.privacy,
      marketingConsent: policyConsent.marketing,
      alarmConsent: alarm,
    };
  };

  const agreeAlarm = async (agree: boolean) => {
    try {
      const requestData = generateSignInData(agree);
      await signUp(requestData);

      await requestLogin(email, password);
      await FirebaseAnalytics.logEvent({
        name: 'signup_complete',
        params: {},
      });
      await FirebaseAnalytics.setUserProperty({
        name: 'signup_date',
        value: new Date().toLocaleString(),
      });
      await FirebaseAnalytics.setUserProperty({
        name: 'signup_country',
        value: region.koreanName,
      });
      await FirebaseAnalytics.setUserProperty({
        name: 'signup_phone_verification',
        value: phoneNumber.length > 0 ? 'true' : 'false',
      });
      await FirebaseAnalytics.setUserProperty({
        name: 'signup_marketing_agreement',
        value: policyConsent.marketing ? 'true' : 'false',
      });

      if (agree) {
        await FirebaseAnalytics.logEvent({
          name: 'click_allow_notification',
          params: {},
        });
      } else {
        await FirebaseAnalytics.logEvent({
          name: 'click_skip_notification',
          params: {},
        });
      }

      router.push('/', 'root');
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
              {t('allowNotification.title')}
            </IonText>
            <IonText className="text-center whitespace-pre-line font-body1 text-gray5">
              {t('allowNotification.detail')}
            </IonText>
          </div>

          <div className="flex flex-col items-center w-full gap-4">
            <button className="w-full button-primary button-lg" onClick={() => agreeAlarm(true)}>
              {t('allowNotification.allow')}
            </button>
            <IonText className="font-body1 text-gray6" onClick={() => agreeAlarm(false)}>
              {t('allowNotification.skip')}
            </IonText>
          </div>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default AlarmAgreement;
