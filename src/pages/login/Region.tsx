import { IonIcon, IonImg, IonModal, IonText } from '@ionic/react';
import GlobeIcon from '../../assets/svgs/globe.svg';
import LogoWithLabelImage from '../../assets/images/logo-with-label.png';
import SelectRegion from '../../modals/SelectRegion';
import { useState } from 'react';

const LoginLanding = () => {
  const [openModal, setOpenModal] = useState(false);

  return (
    <div className="relative flex flex-col items-center justify-center h-full gap-6">
      <IonText className="text-center whitespace-pre-wrap font-headline1 text-gray8">{`반가워요 :)\n어느 나라에서 오셨나요?`}</IonText>

      <div
        className="flex items-center justify-between p-4 bg-gray1.5 rounded-xl w-[15rem] cursor-pointer mb-[5rem]"
        onClick={() => setOpenModal(true)}
      >
        <IonText className="text-gray5 font-body1">출신 국가를 선택하세요</IonText>
        <IonIcon className="svg-lg" src={GlobeIcon} />
      </div>

      <IonImg className="absolute bottom-4 w-[6.75rem] h-[1.875rem]" src={LogoWithLabelImage} />

      <IonModal isOpen={openModal} initialBreakpoint={0.95} breakpoints={[0, 0.95]}>
        <SelectRegion closeModal={() => setOpenModal(false)} />
      </IonModal>
    </div>
  );
};

export default LoginLanding;