import { IonContent, IonPage } from '@ionic/react';
import { useRef } from 'react';
import { Clipboard } from '@capacitor/clipboard';
import { useTranslation } from 'react-i18next';

import Header from '../../components/Header';
import Toast from '../../toasts/Toast';

const Support = () => {
  const { t } = useTranslation();

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
        <Header type="back" title={t('contactUs.title')} />

        <div className="flex items-center justify-center w-full h-full px-[2.375rem] -mt-14">
          <div className="w-full">
            <p className="text-center text-gray5.5 font-subheading3 whitespace-pre-wrap mb-2">
              {t('contactUs.detail')}
            </p>
            <p className="mb-8 text-center font-heading text-gray7">peoplehere986@gmail.com</p>

            <button
              className="w-full button-gray button-lg font-subheading1 text-gray6"
              onClick={copyText}
            >
              {t('contactUs.copy')}
            </button>
          </div>
        </div>

        <button id="copy-toast" ref={buttonRef} className="hidden" />
      </IonContent>
      <Toast type="info" trigger="copy-toast" message={t('contactUs.copyToast')} />
    </IonPage>
  );
};

export default Support;
