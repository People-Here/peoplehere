import { IonContent, IonPage, IonText, useIonRouter } from '@ionic/react';
import { useState } from 'react';

import Header from '../../components/Header';
import LabelInput from '../../components/LabelInput';
import SelectInput from '../../components/SelectInput';
import SelectRegion from '../../modals/SelectRegion';
import Alert from '../../components/Alert';
import useSignInStore from '../../stores/signIn';

const PhoneAuth = () => {
  const router = useIonRouter();
  const { region } = useSignInStore((state) => state);

  const [phoneNumber, setPhoneNumber] = useState('');
  const [authCode, setAuthCode] = useState('');
  const [showCodeInput, setShowCodeInput] = useState(false);

  return (
    <IonPage>
      <IonContent fullscreen>
        <Header type="back" title="본인인증" />

        <div className="flex flex-col gap-2 px-4 mt-5">
          <SelectInput
            id="region-modal"
            label="국가/지역"
            value={`${region.koreanName} (+${String(region.dialCode).padStart(2, '0')})`}
          />

          <div className="flex items-center gap-2">
            <LabelInput
              label="전화번호"
              type="tel"
              inputMode="tel"
              value={phoneNumber}
              onChange={setPhoneNumber}
            />

            <button
              className="px-3 button-primary button-lg shrink-0"
              disabled={!phoneNumber.length}
              onClick={() => setShowCodeInput(true)}
            >
              <IonText className="text-white font-body1">인증코드 발송</IonText>
            </button>
          </div>

          <IonText id="phone-alert" className="pl-1 underline font-body1 text-gray5">
            전화번호 인증이 불가한가요?
          </IonText>

          {showCodeInput ? (
            <div className="mt-[2.875rem] animate-fade-down">
              <IonText className="pl-1 font-body2 text-gray6">남은 시간 3:00</IonText>

              <div className="flex items-center gap-2 mt-2">
                <LabelInput
                  label="인증번호 입력"
                  inputMode="numeric"
                  value={authCode}
                  onChange={setAuthCode}
                />

                <button
                  className="px-3 w-[6.25rem] button-primary button-lg shrink-0"
                  disabled={!authCode.length}
                >
                  <IonText className="text-white font-body1">확인</IonText>
                </button>
              </div>
            </div>
          ) : null}
        </div>

        <SelectRegion trigger="region-modal" />

        <Alert
          trigger="phone-alert"
          title="전화번호 인증이 어려운 상황인가요?"
          buttons={[{ text: '취소' }, { text: '네', onClick: () => router.push('/sign-up/email') }]}
        />
      </IonContent>
    </IonPage>
  );
};

export default PhoneAuth;