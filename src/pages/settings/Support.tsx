import { IonContent, IonPage } from '@ionic/react';

import Header from '../../components/Header';

const Support = () => {
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

            <a href="mailto:peoplehere986@gmail.com">
              <button className="w-full button-gray button-lg font-subheading1 text-gray6">
                이메일 보내기
              </button>
            </a>
          </div>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Support;
