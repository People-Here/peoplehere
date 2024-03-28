import { useState } from 'react';
import { IonText, useIonRouter } from '@ionic/react';

import Header from '../../components/Header';
import LabelInput from '../../components/LabelInput';

const CheckEmail = () => {
  const router = useIonRouter();

  const [email, setEmail] = useState('');
  const [authCode, setAuthCode] = useState('');

  return (
    <>
      <Header type="close" title="비밀번호 재설정" />

      <div className="px-4 mt-5">
        <IonText className="font-body1 text-gray7">가입하신 이메일을 입력해 주세요.</IonText>

        <div className="flex items-center gap-2 mt-2">
          <LabelInput label="이메일" value={email} onChange={setEmail} />

          <button className="px-3 button-primary button-lg shrink-0" disabled={!email.length}>
            <IonText className="text-white font-body1">인증코드 발송</IonText>
          </button>
        </div>

        <div className="flex items-center gap-2 mt-3">
          <LabelInput label="인증번호 입력" value={authCode} onChange={setAuthCode} />

          <button
            className="px-3 button-primary button-lg shrink-0 w-[100px]"
            disabled={!authCode.length}
            onClick={() => router.push('/reset-password')}
          >
            <IonText className="text-white font-body1">확인</IonText>
          </button>
        </div>
      </div>
    </>
  );
};

export default CheckEmail;
