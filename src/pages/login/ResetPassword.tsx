import { IonText, useIonRouter } from '@ionic/react';
import Header from '../../components/Header';
import PasswordInput from '../../components/PasswordInput';
import { useState } from 'react';
import PasswordValidator from '../../components/PasswordValidator';
import Footer from '../../layouts/Footer';
import { PASSWORD_VALIDATION } from '../../constants/regex';

const ResetPassword = () => {
  const router = useIonRouter();

  const [password, setPassword] = useState('');

  const isPasswordValid =
    PASSWORD_VALIDATION.moreThan8.test(password) &&
    PASSWORD_VALIDATION.hasSpecialCharOrNumber.test(password);

  return (
    <>
      <Header type="close" title="비밀번호 재설정" />

      <div className="flex flex-col gap-2 px-4 mt-5">
        <IonText className="font-body1 text-gray7">가입하신 이메일을 입력해 주세요.</IonText>

        <PasswordInput value={password} onChange={setPassword} />

        <PasswordValidator password={password} />
      </div>

      <Footer>
        <button
          className="w-full button-primary button-lg"
          disabled={!isPasswordValid}
          onClick={() => router.push('/login')}
        >
          계속
        </button>
      </Footer>
    </>
  );
};

export default ResetPassword;
