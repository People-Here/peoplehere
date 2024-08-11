import { IonContent, IonPage, IonText, useIonRouter } from '@ionic/react';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FirebaseAnalytics } from '@capacitor-community/firebase-analytics';

import Header from '../../components/Header';
import LabelInput from '../../components/LabelInput';
import ProgressDots from '../../components/ProgressDots';
import { checkEmail, sendEmailCode, verifyEmailCode } from '../../api/verification';
import { EMAIL_VALIDATION } from '../../constants/regex';
import useSignInStore from '../../stores/signIn';
import { getTranslateLanguage } from '../../utils/translate';

import type { AxiosError } from 'axios';

const EmailAuth = () => {
  const { t } = useTranslation();

  const router = useIonRouter();
  const setEmail = useSignInStore((state) => state.setEmail);

  const [emailInput, setEmailInput] = useState('');
  const [authCode, setAuthCode] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [showAuthCodeInput, setShowAuthCodeInput] = useState(false);
  const [authErrorMessage, setAuthErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!errorMessage || !emailInput) return;

    setErrorMessage('');
  }, [emailInput]);

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    FirebaseAnalytics.setScreenName({
      screenName: 'set_email',
    });
  }, []);

  const checkEmailExist = async () => {
    setErrorMessage('');
    setIsLoading(true);

    const lang = await getTranslateLanguage();
    const textLanguage = lang === 'KOREAN' ? 'KOREAN' : 'ENGLISH';

    try {
      await checkEmail(emailInput);
      try {
        await sendEmailCode(emailInput, textLanguage);
        setAuthCode('');
        setShowAuthCodeInput(true);
      } catch (error) {
        const errorInstance = error as AxiosError;

        if (errorInstance.response?.status === 403) {
          setErrorMessage(t('code.limit'));
        }
      }
    } catch (error) {
      const errorInstance = error as AxiosError;

      if (errorInstance.response?.status === 400) {
        setErrorMessage(t('user.invalidEmail'));
      }

      if (errorInstance.response?.status === 409) {
        setErrorMessage(t('loginInfo.emailInUse'));
      }
    } finally {
      setIsLoading(false);
    }
  };

  const confirmAuthCode = async () => {
    const response = await verifyEmailCode(emailInput, authCode);

    if (response.data === true) {
      setEmail(emailInput);
      router.push('/sign-up/password');
    } else {
      setAuthErrorMessage(t('code.wrong'));
    }
  };

  return (
    <IonPage>
      <IonContent fullscreen>
        <Header type="back" />

        <div className="px-4 mt-5">
          <ProgressDots total={3} current={1} />
          <h1 className="font-headline1 text-[#1D1B20] whitespace-pre-wrap mt-3">
            {t('loginInfo.email')}
          </h1>

          <div className="flex gap-2 mt-5">
            <LabelInput
              label={t('user.email')}
              type="email"
              inputMode="email"
              value={emailInput}
              onChange={setEmailInput}
              errorText={errorMessage}
            />

            <button
              className={
                showAuthCodeInput
                  ? 'button-sub button-lg shrink-0 w-[100px]'
                  : 'px-3 button-primary button-lg shrink-0 w-[100px]'
              }
              disabled={!EMAIL_VALIDATION.test(emailInput) || isLoading}
              onClick={checkEmailExist}
            >
              <IonText className="font-body1">
                {showAuthCodeInput
                  ? t('code.resend')
                  : isLoading
                    ? t('code.sending')
                    : t('code.send')}
              </IonText>
            </button>
          </div>

          {showAuthCodeInput && (
            <>
              <div className="flex gap-2 mt-3 animate-fade-down">
                <LabelInput
                  label={t('code.placeholder')}
                  inputMode="numeric"
                  value={authCode}
                  onChange={setAuthCode}
                  errorText={authErrorMessage}
                />

                <button
                  className="px-3 button-primary button-lg w-[100px] shrink-0"
                  disabled={!authCode.length}
                  onClick={confirmAuthCode}
                >
                  <IonText className="font-body1">{t('code.verify')}</IonText>
                </button>
              </div>

              <div className="flex flex-col gap-1 mt-6">
                <p className="font-body1 text-gray6">{t('code.tip.title')}</p>
                <ul className="pl-4 list-disc">
                  <li className="font-caption2 text-gray5.5">{t('code.tip.first')}</li>
                  <li className="font-caption2 text-gray5.5">{t('code.tip.second')}</li>
                </ul>
              </div>
            </>
          )}
        </div>
      </IonContent>
    </IonPage>
  );
};

export default EmailAuth;
