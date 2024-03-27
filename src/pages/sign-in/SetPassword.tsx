import { useState } from 'react';
import Header from '../../components/Header';
import LabelInput from '../../components/LabelInput';
import ProgressDots from '../../components/ProgressDots';
import PasswordValidator from '../../components/PasswordValidator';
import Footer from '../../layouts/Footer';
import { PASSWORD_VALIDATION } from '../../constants/regex';
import { IonContent } from '@ionic/react';

const SetPassword = () => {
  const email = 'kim@gmail.com';
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

          <LabelInput label="비밀번호를 설정해 주세요" value={password} onChange={setPassword} />
          <PasswordValidator password={password} />
        </div>
      </div>

      <Footer>
        <button className="w-full button-primary button-lg" disabled={!isPasswordValid}>
          계속
        </button>
      </Footer>
    </IonContent>
  );
};

export default SetPassword;
