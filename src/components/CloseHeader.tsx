import { IonIcon } from '@ionic/react';

import CloseIcon from '../assets/svgs/close.svg';

const CloseHeader = () => {
  return (
    <header>
      <div className="flex items-center p-4">
        <IonIcon icon={CloseIcon} className="svg-lg" />
      </div>
    </header>
  );
};

export default CloseHeader;
