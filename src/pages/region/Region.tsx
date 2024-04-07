import { IonIcon, IonImg, IonText, useIonRouter } from '@ionic/react';
import { useEffect } from 'react';

import GlobeIcon from '../../assets/svgs/globe.svg';
import LogoWithLabelImage from '../../assets/images/logo-with-label.png';
import SelectRegion from '../../modals/SelectRegion';
import useUserStore from '../../stores/userInfo';

const LoginLanding = () => {
  const router = useIonRouter();
  const { region } = useUserStore((state) => state);

  useEffect(() => {
    if (region['2digitCode']) {
      router.push('/');
    }
  }, [region, router]);

  return (
    <div className="relative flex flex-col items-center justify-center h-full gap-6">
      <IonText className="text-center whitespace-pre-wrap font-headline1 text-gray8">{`반가워요 :)\n어느 나라에서 오셨나요?`}</IonText>

      <div
        className="flex items-center justify-between p-4 bg-gray1.5 rounded-xl w-[15rem] cursor-pointer mb-[5rem]"
        id="region-modal"
      >
        <IonText className="text-gray5 font-body1">출신 국가를 선택하세요</IonText>
        <IonIcon className="svg-lg" src={GlobeIcon} />
      </div>

      <IonImg className="absolute bottom-4 w-[6.75rem] h-[1.875rem]" src={LogoWithLabelImage} />

      <SelectRegion trigger="region-modal" />
    </div>
  );
};

export default LoginLanding;
