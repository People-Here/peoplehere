import { useState } from 'react';
import Header from '../../components/Header';
import LabelInput from '../../components/LabelInput';
import { IonText } from '@ionic/react';
import ProgressDots from '../../components/ProgressDots';

const EmailAuth = () => {
  const [email, setEmail] = useState('');
  const [authCode, setAuthCode] = useState('');

  return (
    <>
      <Header type="back" />

      <div className="px-4 mt-5">
        <ProgressDots total={3} current={1} />
        <h1 className="font-headline1 text-[#1D1B20] whitespace-pre-wrap mt-3">
          {'아이디로 사용할\n이메일을 설정해 주세요'}
        </h1>

        <div className="flex items-center gap-2 mt-5">
          <LabelInput label="이메일" value={email} onChange={setEmail} />

          <button className="px-3 button-primary button-lg shrink-0" disabled={!email.length}>
            <IonText className="text-white font-body1">인증코드 발송</IonText>
          </button>
        </div>

        <div className="flex items-center gap-2 mt-3">
          <LabelInput label="인증번호 입력" value={authCode} onChange={setAuthCode} />

          <button
            className="px-3 button-primary button-lg w-[100px] shrink-0"
            disabled={!authCode.length}
          >
            <IonText className="text-white font-body1">확인</IonText>
          </button>
        </div>
      </div>
    </>
  );
};

export default EmailAuth;
