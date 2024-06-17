import { IonContent, IonPage, IonText } from '@ionic/react';
import { useEffect, useRef, useState } from 'react';

import Header from '../../components/Header';
import LabelInput from '../../components/LabelInput';
import { checkEmail, sendEmailCode, verifyEmailCode } from '../../api/verification';
import Toast from '../../toasts/Toast';
import { updateUserEmail } from '../../api/profile';
import useLogin from '../../hooks/useLogin';
import { getTranslateLanguage } from '../../utils/translate';

import type { AxiosError } from 'axios';

const ChangeEmail = () => {
  const { requestLogout } = useLogin();

  const buttonRef = useRef<HTMLButtonElement>(null);

  const [email, setEmail] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [showAuthCodeInput, setShowAuthCodeInput] = useState(false);
  const [authCode, setAuthCode] = useState('');

  useEffect(() => {
    if (!errorMessage || !email) return;

    setErrorMessage('');
  }, [email]);

  const checkEmailValid = async () => {
    const lang = await getTranslateLanguage();
    const textLanguage = lang === 'KOREAN' ? 'KOREAN' : 'ENGLISH';

    try {
      await checkEmail(email);
      setAuthCode('');
      setShowAuthCodeInput(true);
      await sendEmailCode(email, textLanguage);
    } catch (error) {
      const errorInstance = error as AxiosError;

      if (errorInstance.response?.status === 400) {
        setErrorMessage('이메일 형식이 유효하지 않아요.');
      }

      if (errorInstance.response?.status === 409) {
        setErrorMessage('이미 가입한 이메일이에요.');
      }
    }
  };

  const confirmAuthCode = async () => {
    const response = await verifyEmailCode(email, authCode);

    if (response.status === 200) {
      await changeEmail();
    }
  };

  const changeEmail = async () => {
    try {
      await updateUserEmail(email);
      buttonRef.current?.click();
      await requestLogout();
    } catch (error) {
      console.error('fail to update email', error);
    }
  };

  return (
    <IonPage>
      <IonContent fullscreen>
        <Header type="close" title="이메일 수정" />

        <div className="px-4 mt-5">
          <p className="font-body1 text-gray7">
            새 이메일 주소를 저장하면 확인용 이메일을 보내드려요.
          </p>

          <div className="flex gap-2 mt-2">
            <LabelInput
              label="이메일"
              type="email"
              inputMode="email"
              value={email}
              onChange={setEmail}
              errorText={errorMessage}
            />

            <button
              className={
                showAuthCodeInput
                  ? 'px-3 button-sub button-lg w-[100px] shrink-0'
                  : 'px-3 button-primary button-lg w-[100px] shrink-0'
              }
              disabled={!email.length}
              onClick={checkEmailValid}
            >
              <IonText className="font-body1">
                {showAuthCodeInput ? '재발송' : '인증코드 발송'}
              </IonText>
            </button>
          </div>

          {showAuthCodeInput && (
            <div className="mt-3 animate-fade-down">
              <div className="flex items-center gap-2">
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

              <div className="mt-6">
                <p className="font-body1 text-gray6">코드를 받지 못하셨나요?</p>
                <ul className="list-disc font-caption2 text-gray5.5 pl-5 mt-1">
                  <li>코드가 도착하는데 최대 5분이 걸릴 수 있습니다.</li>
                  <li>스팸 폴더를 확인하세요.</li>
                </ul>
              </div>
            </div>
          )}
        </div>

        <button className="hidden" ref={buttonRef} />
        <Toast type="info" trigger="resend-email-toast" message="이메일 수정을 완료했어요." />
      </IonContent>
    </IonPage>
  );
};

export default ChangeEmail;
