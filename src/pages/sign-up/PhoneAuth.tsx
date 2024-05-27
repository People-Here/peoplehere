import { IonContent, IonPage, IonText, useIonRouter } from '@ionic/react';
import { memo, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import Header from '../../components/Header';
import LabelInput from '../../components/LabelInput';
import SelectInput from '../../components/SelectInput';
import SelectRegion from '../../modals/SelectRegion';
import Alert from '../../components/Alert';
import useSignInStore from '../../stores/signIn';
import { sendPhoneCode, verifyPhoneCode } from '../../api/verification';
import { secondToMinuteSecond } from '../../utils/date';

const PhoneAuth = () => {
  const { t } = useTranslation();

  const router = useIonRouter();
  const { region, setPhoneNumber } = useSignInStore((state) => state);

  const [phoneNumberInput, setPhoneNumberInput] = useState('');
  const [authCode, setAuthCode] = useState('');
  const [showCodeInput, setShowCodeInput] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [authErrorMessage, setAuthErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const [timeLeft, setTimeLeft] = useState(0);

  useEffect(() => {
    if (!timeLeft) return;

    const interval = setInterval(() => {
      setTimeLeft(timeLeft - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [timeLeft]);

  const sendAuthCode = async () => {
    setErrorMessage('');
    setIsLoading(true);

    try {
      await sendPhoneCode(region.countryCode, phoneNumberInput);
      setShowCodeInput(true);
      setTimeLeft(180);
    } catch (error) {
      console.error('fail to send phone code', error);
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
          <SelectInput
            id="region-modal"
            label="국가/지역"
            value={`${region.koreanName} (+${String(region.dialCode).padStart(2, '0')})`}
          />

          <div className="flex items-center gap-2">
            <LabelInput
              label="전화번호"
              type="tel"
              inputMode="tel"
              value={phoneNumberInput}
              onChange={setPhoneNumberInput}
            />

            <button
              className={
                showCodeInput
                  ? 'button-sub button-lg shrink-0 w-[100px]'
                  : 'px-3 button-primary button-lg shrink-0 w-[100px]'
              }
              disabled={isLoading}
              onClick={sendAuthCode}
            >
              <IonText className="font-body1">
                {showCodeInput
                  ? t('signup.verify.resend')
                  : isLoading
                    ? t('signup.email.sending')
                    : t('signup.verify.send')}
              </IonText>
            </button>
          </div>

          <IonText id="phone-alert" className="pl-1 underline font-body1 text-gray5">
            전화번호 인증이 불가한가요?
          </IonText>

          {showCodeInput ? (
            <div className="mt-[2.875rem] animate-fade-down">
              <Timer timeLeft={timeLeft} />

              <div className="flex items-center gap-2 mt-2">
                <LabelInput
                  label={t('signup.verify.placeholder')}
                  inputMode="numeric"
                  value={authCode}
                  onChange={setAuthCode}
                />

                <button
                  className="px-3 w-[6.25rem] button-primary button-lg shrink-0"
                  disabled={authCode.length !== 6 || timeLeft === 0}
                  onClick={confirmAuthCode}
                >
                  <IonText className="text-white font-body1">{t('common.confirm')}</IonText>
                </button>
              </div>

              {authErrorMessage && (
                <IonText className="font-caption2 text-red3">{authErrorMessage}</IonText>
              )}
            </div>
          ) : null}
        </div>

        <SelectRegion trigger="region-modal" />

        <Alert
          trigger="phone-alert"
          title="전화번호 인증이 어려운 상황인가요?"
          buttons={[{ text: '취소' }, { text: '네', onClick: () => router.push('/sign-up/email') }]}
        />
      </IonContent>
    </IonPage>
  );
};

type TimerProps = {
  timeLeft: number;
};
const Timer = memo(({ timeLeft }: TimerProps) => {
  return (
    <IonText className="pl-1 font-body2 text-gray6">
      남은 시간 {secondToMinuteSecond(timeLeft)}
    </IonText>
  );
});
Timer.displayName = 'Timer';

export default PhoneAuth;
