import { useEffect, useRef, useState } from 'react';
import { IonContent, IonPage, IonText, useIonRouter } from '@ionic/react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { FirebaseAnalytics } from '@capacitor-community/firebase-analytics';

import LabelInput from '../../components/LabelInput';
import PasswordValidator from '../../components/PasswordValidator';
import { EMAIL_VALIDATION, PASSWORD_VALIDATION } from '../../constants/regex';
import PasswordInput from '../../components/PasswordInput';
import Header from '../../components/Header';
import useLogin from '../../hooks/useLogin';
import Alert from '../../components/Alert';

const Login = () => {
  const { t } = useTranslation();

  const router = useIonRouter();
  const { requestLogin } = useLogin();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const buttonRef = useRef<HTMLButtonElement>(null);

  const isEmailValid = EMAIL_VALIDATION.test(email);
  const isPasswordValid =
    PASSWORD_VALIDATION.moreThan8.test(password) &&
    PASSWORD_VALIDATION.hasSpecialCharOrNumber.test(password);

  const tryLogin = async () => {
    if (!isEmailValid) {
      setErrorMessage(t('user.invalidEmail'));
      return;
    }

    try {
      await requestLogin(email, password);
      router.push('/', 'root', 'replace');
    } catch (error) {
      console.error('login failed with error:', error);

      buttonRef.current?.click();
    }
  };

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    FirebaseAnalytics.setScreenName({
      screenName: 'login',
      nameOverride: 'Login',
    });
  }, []);

  return (
    <IonPage>
      <IonContent fullscreen>
        <Header type="close" />

        <div className="flex flex-col items-center justify-center px-4 mt-[3.125rem]">
          <h1 className="font-suite text-orange5 text-[2rem] font-black leading-[1.875rem] mb-12">
            PeopleHere
          </h1>

          <div className="flex flex-col w-full gap-2 mb-4">
            <LabelInput
              label={t('user.email')}
              type="email"
              inputMode="email"
              value={email}
              onChange={setEmail}
              errorText={errorMessage}
            />
            <PasswordInput value={password} onChange={setPassword} />
            <PasswordValidator password={password} />
          </div>

          <div className="flex flex-col w-full gap-3 mb-4">
            <button
              className="text-white bg-orange5 button-lg disabled:bg-gray4"
              disabled={!email.length || !isPasswordValid}
              onClick={tryLogin}
            >
              {t('user.login')}
            </button>
            <button
              className="button-primary button-lg"
              onClick={() => {
                router.push('/sign-up/phone');
              }}
            >
              {t('user.signup')}
            </button>
          </div>

          <Link to="/reset-password/check-email">
            <IonText className="font-caption2 text-gray5.5 underline">
              {t('resetPassword.title')}
            </IonText>
          </Link>
        </div>

        <button id="error-alert" ref={buttonRef} type="button" className="hidden" />
        <Alert
          trigger="error-alert"
          title={t('loginError')}
          buttons={[{ text: t('progress.retry') }]}
          bottomText={t('resetPassword.title')}
          onClickBottomText={() => router.push('/reset-password/check-email')}
        />
      </IonContent>
    </IonPage>
  );
};

export default Login;
