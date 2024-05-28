/* eslint-disable @typescript-eslint/no-misused-promises */
import { IonIcon, IonModal, IonText } from '@ionic/react';
import { useRef, type ComponentProps, type PropsWithChildren } from 'react';

import CloseIcon from '../assets/svgs/close.svg';

export type ModalProps = {
  trigger?: string;
  isOpen?: boolean;
  onClickButton?: () => void;
  onWillDismiss?: () => void;
  onDidDismiss?: () => void;
};

type Props = {
  title: string;
  buttonText: string;
  buttonDisabled?: boolean;
};

const ModalContainer = ({
  trigger,
  isOpen,
  title,
  buttonText,
  buttonDisabled,
  onClickButton,
  children,
  ...rest
}: PropsWithChildren<ModalProps & Props & ComponentProps<typeof IonModal>>) => {
  // eslint-disable-next-line no-undef
  const modalRef = useRef<HTMLIonModalElement>(null);

  return (
    <IonModal ref={modalRef} trigger={trigger} isOpen={isOpen} {...rest}>
      <div className={'relative p-4 pt-10 mb-28'}>
        <IonIcon
          className="absolute svg-lg stroke-gray7 top-4 right-4"
          src={CloseIcon}
          onClick={() => modalRef.current?.dismiss()}
        />

        <IonText className="mb-5 font-headline2 text-gray8">{title}</IonText>

        {children}

        <button
          className="w-full button-primary button-lg"
          disabled={buttonDisabled}
          onClick={async () => {
            onClickButton && onClickButton();
            await modalRef.current?.dismiss();
          }}
        >
          {buttonText}
        </button>
      </div>
    </IonModal>
  );
};

export default ModalContainer;
