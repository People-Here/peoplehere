import { IonContent, IonPage, IonText } from '@ionic/react';
import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';

import Header from '../../components/Header';
import LabelInput from '../../components/LabelInput';
import { checkEmail, sendEmailCode, verifyEmailCode } from '../../api/verification';
import Toast from '../../toasts/Toast';
import { updateUserEmail } from '../../api/profile';
import useLogin from '../../hooks/useLogin';
import { getTranslateLanguage } from '../../utils/translate';
import { EMAIL_VALIDATION } from '../../constants/regex';

import type { AxiosError } from 'axios';

const ChangeEmail = () => {
  const { t } = useTranslation();
  const { requestLogout } = useLogin();

  const buttonRef = useRef<HTMLButtonElement>(null);

  const [email, setEmail] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [showAuthCodeInput, setShowAuthCodeInput] = useState(false);
  const [authCode, setAuthCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!errorMessage || !email) return;

    setErrorMessage('');
  }, [email]);

  const checkEmailValid = async () => {
    setErrorMessage('');
    setIsLoading(true);

    const lang = await getTranslateLanguage();
    const textLanguage = lang === 'KOREAN' ? 'KOREAN' : 'ENGLISH';

    try {
      await checkEmail(email);
      setAuthCode('');
      setShowAuthCodeInput(true);
      await sendEmailCode(email, textLanguage);
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
    const response = await verifyEmailCode(email, authCode);

    if (response.status === 200) {
      await changeEmail();
    }
  };

  const changeEmail = async () => {
    try {
      await updateUserEmail(email);
      buttonRef.current?.click();
      await requestLogout();
    } catch (error) {
      console.error('fail to update email', error);
    }
  };

  return (
    <IonPage>
      <IonContent fullscreen>
        <Header type="close" title={t('personal.editEmail')} />

        <div className="px-4 mt-5">
          <p className="font-body1 text-gray7">{t('personal.emailDetail')}</p>

          <div className="flex gap-2 mt-2">
            <LabelInput
              label={t('user.email')}
              type="email"
              inputMode="email"
              value={email}
              onChange={setEmail}
              errorText={errorMessage}
            />

            <button
              className={
                showAuthCodeInput
                  ? 'button-sub button-lg shrink-0 w-[100px]'
                  : 'px-3 button-primary button-lg shrink-0 w-[100px]'
              }
              disabled={!EMAIL_VALIDATION.test(email) || isLoading}
              onClick={checkEmailValid}
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
            <div className="mt-3 animate-fade-down">
              <div className="flex items-center gap-2">
                <LabelInput
                  label={t('code.placeholder')}
                  inputMode="numeric"
                  value={authCode}
                  onChange={setAuthCode}
                />

                <button
                  className="px-3 button-primary button-lg shrink-0 w-[100px]"
                  disabled={!authCode.length}
                  onClick={confirmAuthCode}
                >
                  <IonText className="font-body1">{t('code.verify')}</IonText>
                </button>
              </div>

              <div className="mt-6">
                <p className="font-body1 text-gray6">{t('code.tip.title')}</p>
                <ul className="list-disc font-caption2 text-gray5.5 pl-5 mt-1">
                  <li>{t('code.tip.first')}</li>
                  <li>{t('code.tip.second')}</li>
                </ul>
              </div>
            </div>
          )}
        </div>

        <button className="hidden" ref={buttonRef} />
        <Toast type="info" trigger="resend-email-toast" message={t('personal.emailConfirmed')} />
      </IonContent>
    </IonPage>
  );
};

export default ChangeEmail;
