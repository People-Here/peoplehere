import { IonButtons, IonIcon, IonTitle, IonToolbar, useIonRouter } from '@ionic/react';

import CloseIcon from '../assets/svgs/close.svg';
import ArrowLeftIcon from '../assets/svgs/arrow-left.svg';

type Props = {
  type: 'close' | 'back';
  title?: string;
  onClickIcon?: () => void;
};

const Header = ({ type, title, onClickIcon }: Props) => {
  const router = useIonRouter();

  return (
    <IonToolbar className="px-4 h-14">
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
