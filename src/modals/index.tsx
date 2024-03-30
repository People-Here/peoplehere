import { IonIcon, IonText } from '@ionic/react';

import CloseIcon from '../assets/svgs/close.svg';

import type { PropsWithChildren } from 'react';

type Props = {
  title: string;
};

const ModalContainer = ({ title, children }: PropsWithChildren<Props>) => {
  return (
    <div className="relative p-4 pt-10 mb-28">
      <IonIcon className="absolute svg-lg stroke-gray7 top-4 right-4" src={CloseIcon} />

      <IonText className="mb-5 font-headline2 text-gray8">{title}</IonText>

      {children}
    </div>
  );
};

export default ModalContainer;
