import { useState } from 'react';
import { IonText, useIonRouter } from '@ionic/react';

import CloseHeader from '../../components/CloseHeader';
import LabelInput from '../../components/LabelInput';
import PasswordValidator from '../../components/PasswordValidator';
import { EMAIL_VALIDATION, PASSWORD_VALIDATION } from '../../constants/regex';
import PasswordInput from '../../components/PasswordInput';

const Login = () => {
  const router = useIonRouter();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const isEmailValid = EMAIL_VALIDATION.test(email);
  const isPasswordValid =
    PASSWORD_VALIDATION.moreThan8.test(password) &&
    PASSWORD_VALIDATION.hasSpecialCharOrNumber.test(password);

  return (
    <>
      <CloseHeader />

      <div className="flex flex-col items-center justify-center px-4 mt-[3.125rem]">
        <h1 className="font-suite text-orange5 text-[2rem] font-black leading-[1.875rem]">
          PeopleHere
        </h1>
        <p className="mt-4 mb-12 text-center whitespace-pre-wrap font-body1 text-gray6">
          {'여기를 살아가는 사람들을 만나,\n이곳의 삶을 여행하세요.'}
        </p>

        <div className="flex flex-col w-full gap-2 mb-4">
          <LabelInput label="이메일" value={email} onChange={setEmail} />
          <PasswordInput value={password} onChange={setPassword} />

          <PasswordValidator password={password} />
        </div>

        <div className="flex flex-col w-full gap-3 mb-4">
          <button
            className="text-white bg-orange5 button-lg disabled:bg-gray4"
            disabled={!(isEmailValid || isPasswordValid)}
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

        <IonText className="font-caption2 text-gray5.5">비밀번호 재설정</IonText>
      </div>
    </>
  );
};

export default Login;
