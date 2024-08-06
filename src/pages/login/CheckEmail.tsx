import { IonContent, IonPage, IonText, useIonRouter } from '@ionic/react';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import Header from '../../components/Header';
import LabelInput from '../../components/LabelInput';
import { checkEmailExist, sendEmailCode, verifyEmailCode } from '../../api/verification';
import { getTranslateLanguage } from '../../utils/translate';

import type { AxiosError } from 'axios';

const CheckEmail = () => {
  const { t } = useTranslation();

  const router = useIonRouter();

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

  const checkEmail = async () => {
    setErrorMessage('');
    setIsLoading(true);

    const lang = await getTranslateLanguage();
    const textLanguage = lang === 'KOREAN' ? 'KOREAN' : 'ENGLISH';

    try {
      await checkEmailExist(emailInput);
      try {
        await sendEmailCode(emailInput, textLanguage);
        setAuthCode('');
        setShowAuthCodeInput(true);
      } catch (error) {
        const errorInstance = error as AxiosError;

        if (errorInstance.response?.status === 403) {
          setErrorMessage('하루 이메일 전송 횟수를 초과했어요. 내일 다시 시도해주세요.');
        }
      }
    } catch (error) {
      const errorInstance = error as AxiosError;

      if (errorInstance.response?.status === 400) {
        setErrorMessage(t('error.invalidEmail'));
      }

      if (errorInstance.response?.status === 404) {
        setErrorMessage('가입되지 않은 이메일입니다.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const confirmAuthCode = async () => {
    const response = await verifyEmailCode(emailInput, authCode);

    if (response.data === true) {
      router.push('/reset-password');
    } else {
      setAuthErrorMessage('잘못된 인증 코드를 입력하셨어요');
    }
  };

  return (
    <IonPage>
      <IonContent fullscreen>
        <Header type="close" title={t('resetPassword.title')} />

        <div className="px-4 mt-5">
          <IonText className="font-body1 text-gray7">{t('resetPassword.detail')}</IonText>

          <div className="flex gap-2 mt-2">
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
                  ? 'px-3 button-sub button-lg w-[100px] shrink-0'
                  : 'px-3 button-primary button-lg w-[100px] shrink-0'
              }
              disabled={!emailInput.length || isLoading}
              onClick={checkEmail}
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
              <div className="flex items-center gap-2 mt-3 animate-fade-down">
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

export default CheckEmail;
