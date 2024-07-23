import { IonContent, IonIcon, IonImg, IonPage, IonText, useIonRouter } from '@ionic/react';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import GlobeIcon from '../../assets/svgs/globe.svg';
import LogoWithLabelImage from '../../assets/images/logo-with-label.png';
import SelectRegion from '../../modals/SelectRegion';
import useSignInStore from '../../stores/signIn';

const LoginLanding = () => {
  const { t } = useTranslation();

  const router = useIonRouter();
  const { region } = useSignInStore((state) => state);

  const [showRegionModal, setShowRegionModal] = useState(false);

  useEffect(() => {
    if (region.countryCode) {
      router.push('/');
    }
  }, [region, router]);

  return (
    <IonPage>
      <IonContent fullscreen>
        <div className="relative flex flex-col items-center justify-center h-full gap-6">
          <IonText className="text-center whitespace-pre-wrap font-headline1 text-gray8">
            {t('region.welcome')}
          </IonText>

          <div
            className="flex items-center justify-between p-4 bg-gray1.5 rounded-xl w-[15rem] cursor-pointer mb-[5rem]"
            id="region-modal"
          >
            <IonText className="text-gray5 font-body1">{t('region.placeholder')}</IonText>
            <IonIcon className="svg-lg" src={GlobeIcon} />
          </div>

          <IonImg className="absolute bottom-4 w-[6.75rem] h-[1.875rem]" src={LogoWithLabelImage} />

          <SelectRegion
            isOpen={showRegionModal}
            closeModal={() => setShowRegionModal(false)}
            hideDialCode
          />
        </div>
      </IonContent>
    </IonPage>
  );
};

export default LoginLanding;
