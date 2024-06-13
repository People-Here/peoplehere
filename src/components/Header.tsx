import { IonButtons, IonIcon, IonTitle, IonToolbar, useIonRouter } from '@ionic/react';
import { useLayoutEffect, useState } from 'react';
import { Device } from '@capacitor/device';

import CloseIcon from '../assets/svgs/close.svg';
import ArrowLeftIcon from '../assets/svgs/arrow-left.svg';

import type { DeviceInfo } from '@capacitor/device';

type Props = {
  type: 'close' | 'back';
  title?: string;
  onClickIcon?: () => void;
  fixed?: boolean;
};

const Header = ({ type, title, onClickIcon, fixed = false }: Props) => {
  const router = useIonRouter();

  const [platform, setPlatform] = useState<DeviceInfo['platform']>('web');

  useLayoutEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    (async () => {
      const platformInfo = await Device.getInfo();
      setPlatform(platformInfo.platform);
    })();
  }, []);

  return (
    <IonToolbar
      slot={fixed ? 'fixed' : ''}
      className={
        !fixed
          ? 'px-4 h-14 bg-white'
          : platform === 'web'
            ? 'px-4 bg-white h-14'
            : platform === 'android'
              ? 'px-4 bg-white h-14 content-end'
              : 'px-4 bg-white h-24 content-end'
      }
    >
      <IonButtons slot="start">
        <IonIcon
          src={iconMapper[type]}
          className="svg-lg"
          onClick={() => {
            onClickIcon ? onClickIcon() : router.goBack();
          }}
        />
      </IonButtons>

      {title ? (
        <IonTitle class="ion-text-center" className="font-headline3 text-gray8">
          {title}
        </IonTitle>
      ) : null}
    </IonToolbar>
  );
};

export default Header;

const iconMapper = {
  close: CloseIcon,
  back: ArrowLeftIcon,
};
