import { useState } from 'react';
import { IonContent, useIonRouter } from '@ionic/react';

import Header from '../../components/Header';
import LabelInput from '../../components/LabelInput';
import ProgressDots from '../../components/ProgressDots';
import PasswordValidator from '../../components/PasswordValidator';
import Footer from '../../layouts/Footer';
import { PASSWORD_VALIDATION } from '../../constants/regex';
import PasswordInput from '../../components/PasswordInput';
import useSignInStore from '../../stores/signIn';

const SetPassword = () => {
  const router = useIonRouter();
  const { email, setPassword } = useSignInStore((state) => state);

  const [passwordInput, setPasswordInput] = useState('');

  const isPasswordValid =
    PASSWORD_VALIDATION.moreThan8.test(passwordInput) &&
    PASSWORD_VALIDATION.hasSpecialCharOrNumber.test(passwordInput);

  const onClickNext = () => {
    setPassword(passwordInput);
    router.push('/sign-in/info');
  };

  return (
    <IonContent fullscreen className="relative">
      <Header type="back" />

      <div className="px-4 mt-5">
        <ProgressDots total={3} current={2} />
        <h1 className="font-headline1 text-[#1D1B20] whitespace-pre-wrap mt-3">
          {'비밀번호를\n설정해 주세요'}
        </h1>

        <div className="flex flex-col gap-2 mt-5">
          <LabelInput label="이메일" value={email} onChange={() => {}} readonly />

          <PasswordInput value={passwordInput} onChange={setPasswordInput} />
          <PasswordValidator password={passwordInput} />
        </div>
      </div>

      <Footer>
        <button
          className="w-full button-primary button-lg"
          disabled={!isPasswordValid}
          onClick={onClickNext}
        >
          계속
        </button>
      </Footer>
    </IonContent>
  );
};

export default SetPassword;
