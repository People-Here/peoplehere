import { IonContent, IonPage, IonText, useIonRouter } from '@ionic/react';
import { useState } from 'react';

import Header from '../../components/Header';
import LabelInput from '../../components/LabelInput';
import ProgressDots from '../../components/ProgressDots';
import { checkEmail, sendEmailCode, verifyEmailCode } from '../../api/verification';
import { EMAIL_VALIDATION } from '../../constants/regex';
import useUserStore from '../../stores/userInfo';

const EmailAuth = () => {
  const router = useIonRouter();
  const setEmail = useUserStore((state) => state.setEmail);

  const [emailInput, setEmailInput] = useState('');
  const [authCode, setAuthCode] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [showAuthCodeInput, setShowAuthCodeInput] = useState(false);

  const checkEmailExist = async () => {
    const response = await checkEmail(emailInput);

    if (response.status === 200) {
      setShowAuthCodeInput(true);
      await sendEmailCode(emailInput);
      return;
    }

    if (response.status === 400) {
      setErrorMessage('이메일 형식이 유효하지 않아요.');
    }

    if (response.status === 409) {
      setErrorMessage('이미 가입한 이메일이에요.');
    }
  };

  const confirmAuthCode = async () => {
    const response = await verifyEmailCode(emailInput, authCode);

    if (response.status === 200) {
      setEmail(emailInput);
      router.push('/sign-in/password');
    }
  };

  return (
    <IonPage>
      <IonContent fullscreen>
        <Header type="back" />

        <div className="px-4 mt-5">
          <ProgressDots total={3} current={1} />
          <h1 className="font-headline1 text-[#1D1B20] whitespace-pre-wrap mt-3">
            {'아이디로 사용할\n이메일을 설정해 주세요'}
          </h1>

          <div className="flex items-center gap-2 mt-5">
            <LabelInput label="이메일" value={emailInput} onChange={setEmailInput} />

            <button
              className={
                showAuthCodeInput
                  ? 'button-sub button-lg shrink-0 w-[100px]'
                  : 'px-3 button-primary button-lg shrink-0 w-[100px]'
              }
              disabled={!EMAIL_VALIDATION.test(emailInput)}
              onClick={checkEmailExist}
            >
              <IonText className="font-body1">
                {showAuthCodeInput ? '재발송' : '인증코드 발송'}
              </IonText>
            </button>
          </div>

          {showAuthCodeInput && (
            <div className="flex items-center gap-2 mt-3 animate-fade-down">
              <LabelInput
                label="인증번호 입력"
                type="number"
                value={authCode}
                onChange={setAuthCode}
              />

              <button
                className="px-3 button-primary button-lg w-[100px] shrink-0"
                disabled={!authCode.length}
                onClick={confirmAuthCode}
              >
                <IonText className="text-white font-body1">확인</IonText>
              </button>
            </div>
          )}
        </div>
      </IonContent>
    </IonPage>
  );
};

export default EmailAuth;
