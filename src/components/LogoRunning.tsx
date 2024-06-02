import { IonIcon } from '@ionic/react';

import Logo from '../assets/svgs/logo.svg';

const LogoRunning = () => {
  return (
    <div className="flex items-center justify-center w-full h-4/5 -mt-14">
      <div className="animate-bounce">
        <IonIcon icon={Logo} className="w-40 h-40" />
      </div>
    </div>
  );
};

export default LogoRunning;
