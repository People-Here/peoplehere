import { IonContent, IonPage, IonText, useIonRouter } from '@ionic/react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import Header from '../../components/Header';
import LabelInput from '../../components/LabelInput';
import ProgressDots from '../../components/ProgressDots';
import { checkEmail, sendEmailCode, verifyEmailCode } from '../../api/verification';
import { EMAIL_VALIDATION } from '../../constants/regex';
import useSignInStore from '../../stores/signIn';

import type { AxiosError } from 'axios';

const EmailAuth = () => {
  const { t } = useTranslation();

  const router = useIonRouter();
  const setEmail = useSignInStore((state) => state.setEmail);

  const [emailInput, setEmailInput] = useState('');
  const [authCode, setAuthCode] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [showAuthCodeInput, setShowAuthCodeInput] = useState(true);

  const checkEmailExist = async () => {
    setErrorMessage('');

    try {
      await checkEmail(emailInput);
      setShowAuthCodeInput(true);
      await sendEmailCode(emailInput);
    } catch (error) {
      const errorInstance = error as AxiosError;

      if (errorInstance.response?.status === 400) {
        setErrorMessage(t('error.invalidEmail'));
      }

      if (errorInstance.response?.status === 409) {
        setErrorMessage(t('error.alreadyInUse'));
      }
    }
  };

  const confirmAuthCode = async () => {
    const response = await verifyEmailCode(emailInput, authCode);

    if (response.status === 200) {
      setEmail(emailInput);
      router.push('/sign-up/password');
    }
  };

  return (
    <IonPage>
      <IonContent fullscreen>
        <Header type="back" />

        <div className="px-4 mt-5">
          <ProgressDots total={3} current={1} />
          <h1 className="font-headline1 text-[#1D1B20] whitespace-pre-wrap mt-3">
            {t('signup.email.title')}
          </h1>

          <div className="flex gap-2 mt-5">
            <LabelInput
              label={t('common.email')}
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
              disabled={!EMAIL_VALIDATION.test(emailInput)}
              onClick={checkEmailExist}
            >
              <IonText className="font-body1">
                {showAuthCodeInput ? t('signup.verify.resend') : t('signup.verify.send')}
              </IonText>
            </button>
          </div>

          {showAuthCodeInput && (
            <div className="flex items-center gap-2 mt-3 animate-fade-down">
              <LabelInput
                label={t('signup.verify.placeholder')}
                inputMode="numeric"
                value={authCode}
                onChange={setAuthCode}
              />

              <button
                className="px-3 button-primary button-lg w-[100px] shrink-0"
                disabled={!authCode.length}
                onClick={confirmAuthCode}
              >
                <IonText className="font-body1">{t('common.confirm')}</IonText>
              </button>
            </div>
          )}
        </div>
      </IonContent>
    </IonPage>
  );
};

export default EmailAuth;
