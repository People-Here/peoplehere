import { IonContent, IonPage } from '@ionic/react';
import { useRef } from 'react';
import { Clipboard } from '@capacitor/clipboard';

import Header from '../../components/Header';
import Toast from '../../toasts/Toast';

const Support = () => {
  const buttonRef = useRef<HTMLButtonElement>(null);

  const copyText = async () => {
    await Clipboard.write({
      string: 'peoplehere986@gmail.com',
    });

    buttonRef.current?.click();
  };

  return (
    <IonPage>
      <IonContent fullscreen>
        <Header type="back" title="문의하기" />

        <div className="flex items-center justify-center w-full h-full px-[2.375rem] -mt-14">
          <div className="w-full">
            <p className="text-center text-gray5.5 font-subheading3 whitespace-pre-wrap mb-2">
              {'문의사항이나 개선사항이 있다면\n아래 이메일로 문의해주세요.'}
            </p>
            <p className="mb-8 text-center font-heading text-gray7">peoplehere986@gmail.com</p>

            <button
              className="w-full button-gray button-lg font-subheading1 text-gray6"
              onClick={copyText}
            >
              이메일 복사하기
            </button>
          </div>
        </div>

        <button id="copy-toast" ref={buttonRef} className="hidden" />
      </IonContent>
      <Toast type="info" trigger="copy-toast" message="이메일 주소가 복사되었어요." />
    </IonPage>
  );
};

export default Support;
