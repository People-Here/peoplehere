import { IonIcon, useIonRouter } from '@ionic/react';

import CloseIcon from '../assets/svgs/close.svg';

const CloseHeader = () => {
  const router = useIonRouter();

  return (
    <header>
      <div className="flex items-center p-4">
        <IonIcon icon={CloseIcon} className="svg-lg" onClick={() => router.goBack()} />
      </div>
    </header>
  );
};

export default CloseHeader;
