import { useIonRouter, IonPage, IonContent, IonText } from '@ionic/react';
import { useState, useEffect, memo } from 'react';
import { useTranslation } from 'react-i18next';

import { sendPhoneCode, verifyPhoneCode } from '../../api/verification';
import Alert from '../../components/Alert';
import Header from '../../components/Header';
import LabelInput from '../../components/LabelInput';
import SelectInput from '../../components/SelectInput';
import SelectRegion from '../../modals/SelectRegion';
import useSignInStore from '../../stores/signIn';
import { secondToMinuteSecond } from '../../utils/date';
import useUserStore from '../../stores/user';
import { capitalizeFirstLetter } from '../../utils/mask';
import { getTranslateLanguage } from '../../utils/translate';

const ChangePhone = () => {
  const { t, i18n } = useTranslation();

  const router = useIonRouter();
  const region = useSignInStore((state) => state.region);
  const { user, setUser } = useUserStore((state) => state);

  const [phoneNumberInput, setPhoneNumberInput] = useState(user.phoneNumber);
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
      console.error('fail to send phone code', error);
    } finally {
      setIsLoading(false);
    }
  };

  const confirmAuthCode = async () => {
    setAuthErrorMessage('');

    const response = await verifyPhoneCode(phoneNumberInput, authCode, region.countryCode);

    if (response.data) {
      setUser({ ...user, phoneNumber: phoneNumberInput });
      router.goBack();
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
            value={`${i18n.resolvedLanguage === 'ko' ? region.koreanName : capitalizeFirstLetter(region.englishName)} (${region.dialCode})`}
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

export default ChangePhone;
