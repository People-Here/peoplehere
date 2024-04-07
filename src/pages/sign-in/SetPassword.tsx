import { useState } from 'react';
import { IonContent, useIonRouter } from '@ionic/react';

import Header from '../../components/Header';
import LabelInput from '../../components/LabelInput';
import ProgressDots from '../../components/ProgressDots';
import PasswordValidator from '../../components/PasswordValidator';
import Footer from '../../layouts/Footer';
import { PASSWORD_VALIDATION } from '../../constants/regex';
import PasswordInput from '../../components/PasswordInput';
import useUserStore from '../../stores/userInfo';

const SetPassword = () => {
  const router = useIonRouter();
  const { email } = useUserStore();

  const [password, setPassword] = useState('');

  const isPasswordValid =
    PASSWORD_VALIDATION.moreThan8.test(password) &&
    PASSWORD_VALIDATION.hasSpecialCharOrNumber.test(password);

  return (
    <IonContent className="relative h-full">
      <Header type="back" />

      <div className="px-4 mt-5">
        <ProgressDots total={3} current={2} />
        <h1 className="font-headline1 text-[#1D1B20] whitespace-pre-wrap mt-3">
          {'비밀번호를\n설정해 주세요'}
        </h1>

        <div className="flex flex-col gap-2 mt-5">
          <LabelInput label="이메일" value={email} onChange={() => {}} readonly />

          <PasswordInput value={password} onChange={setPassword} />
          <PasswordValidator password={password} />
        </div>
      </div>

      <Footer>
        <button
          className="w-full button-primary button-lg"
          disabled={!isPasswordValid}
          onClick={() => router.push('/sign-in/info')}
        >
          계속
        </button>
      </Footer>
    </IonContent>
  );
};

export default SetPassword;
