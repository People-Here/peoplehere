import { IonContent, IonPage, IonText, useIonRouter } from '@ionic/react';
import { useState } from 'react';

import Header from '../../components/Header';
import LabelInput from '../../components/LabelInput';
import { checkEmailExist, sendEmailCode, verifyEmailCode } from '../../api/verification';

const CheckEmail = () => {
  const router = useIonRouter();

  const [emailInput, setEmailInput] = useState('');
  const [authCode, setAuthCode] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [showAuthCodeInput, setShowAuthCodeInput] = useState(false);

  const checkEmail = async () => {
    const response = await checkEmailExist(emailInput);

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
      router.push('/reset-password');
    }
  };

  return (
    <IonPage>
      <IonContent fullscreen>
        <Header type="close" title="비밀번호 재설정" />

        <div className="px-4 mt-5">
          <IonText className="font-body1 text-gray7">가입하신 이메일을 입력해 주세요.</IonText>

          <div className="flex items-center gap-2 mt-2">
            <LabelInput
              label="이메일"
              type="email"
              inputMode="email"
              value={emailInput}
              onChange={setEmailInput}
              errorText={errorMessage}
            />

            <button
              className="px-3 button-primary button-lg shrink-0"
              disabled={!emailInput.length}
              onClick={checkEmail}
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
                inputMode="numeric"
                value={authCode}
                onChange={setAuthCode}
              />

              <button
                className="px-3 button-primary button-lg shrink-0 w-[100px]"
                disabled={!authCode.length}
                onClick={confirmAuthCode}
              >
                <IonText className="font-body1">확인</IonText>
              </button>
            </div>
          )}
        </div>
      </IonContent>
    </IonPage>
  );
};

export default CheckEmail;
