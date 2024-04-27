import { useRef, useState } from 'react';
import { IonContent, IonPage, IonText, useIonRouter } from '@ionic/react';
import { Link } from 'react-router-dom';

import LabelInput from '../../components/LabelInput';
import PasswordValidator from '../../components/PasswordValidator';
import { EMAIL_VALIDATION, PASSWORD_VALIDATION } from '../../constants/regex';
import PasswordInput from '../../components/PasswordInput';
import Header from '../../components/Header';
import useLogin from '../../hooks/useLogin';
import Alert from '../../components/Alert';

const Login = () => {
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
      setErrorMessage('유효한 이메일 형식이 아닙니다.');
      return;
    }

    try {
      await requestLogin(email, password);
      router.push('/');
    } catch (error) {
      buttonRef.current?.click();
    }
  };

  return (
    <IonPage>
      <IonContent fullscreen>
        <Header type="close" />

        <div className="flex flex-col items-center justify-center px-4 mt-[3.125rem]">
          <h1 className="font-suite text-orange5 text-[2rem] font-black leading-[1.875rem]">
            PeopleHere
          </h1>
          <p className="mt-4 mb-12 text-center whitespace-pre-wrap font-body1 text-gray6">
            {'여기를 살아가는 사람들을 만나,\n이곳의 삶을 여행하세요.'}
          </p>

          <div className="flex flex-col w-full gap-2 mb-4">
            <LabelInput
              label="이메일"
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
              로그인
            </button>
            <button
              className="button-primary button-lg"
              onClick={() => {
                router.push('/sign-in/phone');
              }}
            >
              회원가입
            </button>
          </div>

          <Link to="/reset-password/check-email">
            <IonText className="font-caption2 text-gray5.5">비밀번호 재설정</IonText>
          </Link>
        </div>

        <button id="error-alert" ref={buttonRef} type="button" className="hidden" />
        <Alert
          trigger="error-alert"
          title={'이메일 또는 비밀번호를\n잘못 입력하셨습니다.'}
          buttons={[{ text: '다시 입력' }]}
          bottomText="비밀번호 재설정"
          onClickBottomText={() => router.push('/reset-password/check-email')}
        />
      </IonContent>
    </IonPage>
  );
};

export default Login;
