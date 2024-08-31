import { IonContent, IonPage, IonText, useIonRouter } from '@ionic/react';
import { memo, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FirebaseAnalytics } from '@capacitor-community/firebase-analytics';

import Header from '../../components/Header';
import LabelInput from '../../components/LabelInput';
import SelectInput from '../../components/SelectInput';
import SelectRegion from '../../modals/SelectRegion';
import Alert from '../../components/Alert';
import useSignInStore from '../../stores/signIn';
import { sendPhoneCode, verifyPhoneCode } from '../../api/verification';
import { secondToMinuteSecond } from '../../utils/date';
import { capitalizeFirstLetter } from '../../utils/mask';
import { getTranslateLanguage } from '../../utils/translate';
import { phoneAuthWhiteList } from '../../constants/phoneAuth';

import type { AxiosError } from 'axios';

const PhoneAuth = () => {
  const { t, i18n } = useTranslation();

  const router = useIonRouter();
  const { region, setPhoneNumber } = useSignInStore((state) => state);

  const [phoneNumberInput, setPhoneNumberInput] = useState('');
  const [authCode, setAuthCode] = useState('');
  const [showCodeInput, setShowCodeInput] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [authErrorMessage, setAuthErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showUnavailableAuth, setShowUnavailableAuth] = useState(false);
  const [showLimitAlert, setShowLimitAlert] = useState(false);
  const [showAlreadyInUseAlert, setShowAlreadyInUseAlert] = useState(false);

  const [timeLeft, setTimeLeft] = useState(0);

  const [showRegionModal, setShowRegionModal] = useState(false);

  useEffect(() => {
    if (!timeLeft) return;

    const interval = setInterval(() => {
      setTimeLeft(timeLeft - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [timeLeft]);

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    FirebaseAnalytics.setScreenName({
      screenName: 'verify_phone',
      nameOverride: 'VerifyPhone',
    });
  }, []);

  useEffect(() => {
    if (!phoneAuthWhiteList.includes(region.dialCode)) {
      setShowUnavailableAuth(true);
    }
  }, [region.countryCode]);

  const sendAuthCode = async () => {
    setAuthCode('');
    setErrorMessage('');
    setIsLoading(true);

    const lang = await getTranslateLanguage();
    const textLanguage = lang === 'KOREAN' ? 'KOREAN' : 'ENGLISH';

    try {
      await sendPhoneCode(region.countryCode, phoneNumberInput, textLanguage);
      setShowCodeInput(true);
      setTimeLeft(180);
    } catch (error) {
      const errorInstance = error as AxiosError;

      if (errorInstance.response?.status === 403) {
        setShowLimitAlert(true);
      }

      if (errorInstance.response?.status === 409) {
        setShowAlreadyInUseAlert(true);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const confirmAuthCode = async () => {
    setAuthErrorMessage('');

    const response = await verifyPhoneCode(phoneNumberInput, authCode, region.countryCode);

    if (response.data) {
      setPhoneNumber(phoneNumberInput);
      router.push('/sign-up/email');
    } else {
      setAuthErrorMessage('잘못된 인증 코드를 입력하셨어요');
    }
  };

  return (
    <IonPage>
      <IonContent fullscreen>
        <Header type="back" title="본인인증" />

        <div className="flex flex-col gap-2 px-4 mt-5">
          <div onClick={() => setShowRegionModal(true)}>
            <SelectInput
              label={t('verifyPhone.countryCode')}
              value={`${i18n.resolvedLanguage === 'ko' ? region.koreanName : capitalizeFirstLetter(region.englishName)} (${region.dialCode})`}
            />
          </div>

          <div className="flex gap-2">
            <LabelInput
              label={t('user.phoneNumber')}
              type="tel"
              inputMode="tel"
              value={phoneNumberInput}
              onChange={setPhoneNumberInput}
              errorText={errorMessage}
            />

            <button
              className={
                showCodeInput
                  ? 'button-sub button-lg shrink-0 w-[100px]'
                  : 'px-3 button-primary button-lg shrink-0 w-[100px]'
              }
              disabled={isLoading || phoneNumberInput.length === 0}
              onClick={sendAuthCode}
            >
              <IonText className="font-body1">
                {showCodeInput ? t('code.resend') : isLoading ? t('code.sending') : t('code.send')}
              </IonText>
            </button>
          </div>

          <IonText id="phone-alert" className="pl-1 underline font-body1 text-gray5">
            {t('verifyPhone.skip')}
          </IonText>

          {showCodeInput ? (
            <div className="mt-[2.875rem] animate-fade-down">
              <Timer timeLeft={timeLeft} />

              <div className="flex items-center gap-2 mt-2">
                <LabelInput
                  label={t('code.placeholder')}
                  inputMode="numeric"
                  value={authCode}
                  onChange={setAuthCode}
                />

                <button
                  className="px-3 w-[6.25rem] button-primary button-lg shrink-0"
                  disabled={authCode.length !== 6 || timeLeft === 0}
                  onClick={confirmAuthCode}
                >
                  <IonText className="text-white font-body1">{t('code.verify')}</IonText>
                </button>
              </div>

              {authErrorMessage && (
                <IonText className="font-caption2 text-red3">{authErrorMessage}</IonText>
              )}
            </div>
          ) : null}
        </div>

        <SelectRegion isOpen={showRegionModal} closeModal={() => setShowRegionModal(false)} />

        <Alert
          trigger="phone-alert"
          title={t('verifyPhone.skipDetail')}
          buttons={[
            { text: t('progress.cancel') },
            { text: t('progress.positive'), onClick: () => router.push('/sign-up/email') },
          ]}
        />

        <Alert
          isOpen={showUnavailableAuth}
          onDismiss={() => setShowUnavailableAuth(false)}
          title={t('verifyPhone.unavailable')}
          buttons={[
            {
              text: t('progress.confirm'),
              onClick: () => router.push('/sign-up/email'),
            },
          ]}
        />

        <Alert
          isOpen={showLimitAlert}
          onDismiss={() => setShowLimitAlert(false)}
          title={t('code.limit')}
          buttons={[{ text: t('progress.confirm') }]}
        />

        <Alert
          isOpen={showAlreadyInUseAlert}
          onDismiss={() => setShowAlreadyInUseAlert(false)}
          title={t('verifyPhone.numberInUse')}
          buttons={[
            {
              text: t('progress.close'),
            },
            {
              text: t('user.login'),
              onClick: () => router.goBack(),
            },
          ]}
        />
      </IonContent>
    </IonPage>
  );
};

type TimerProps = {
  timeLeft: number;
};
const Timer = memo(({ timeLeft }: TimerProps) => {
  const { t } = useTranslation();

  return (
    <IonText className="pl-1 font-body2 text-gray6">
      {t('code.timeLeft')} {secondToMinuteSecond(timeLeft)}
    </IonText>
  );
});
Timer.displayName = 'Timer';

export default PhoneAuth;
