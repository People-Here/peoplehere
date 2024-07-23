/* eslint-disable @typescript-eslint/no-misused-promises */
import { IonIcon, IonModal, IonText } from '@ionic/react';
import { useLayoutEffect, useRef, type ComponentProps, type PropsWithChildren } from 'react';

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

export type FixedModalProps = {
  isOpen: boolean;
  closeModal: () => void;
  onDismiss?: () => void;
  onPresent?: () => void;
  onClickButton?: () => void;
};

type FixedProps = {
  title?: string;
  buttonText?: string;
  buttonDisabled?: boolean;
};
export const FixedModalContainer = ({
  isOpen,
  closeModal,
  onDismiss,
  onPresent,
  title,
  buttonText = '저장',
  onClickButton,
  buttonDisabled,
  children,
}: PropsWithChildren<FixedModalProps & FixedProps>) => {
  useLayoutEffect(() => {
    onPresent?.();
  }, [onPresent]);

  const dismissModal = () => {
    onDismiss?.();
    closeModal();
  };

  if (!isOpen) return null;

  return (
    <section className="fixed top-0 bottom-0 left-0 right-0 z-20 flex items-end w-screen h-screen">
      {/* background */}
      <div
        className="w-full h-full bg-[#1B1D1F] opacity-60 fixed top-0 bottom-0 left-0 right-0"
        onClick={dismissModal}
      />

      {/* contents */}
      <div className="z-30 w-full rounded-t-xl bg-white relative px-4 pt-10 pb-[calc(5.25rem+var(--ion-safe-area-bottom))] max-h-[87.5%]">
        <button onClick={dismissModal} className="absolute stroke-gray7 top-4 right-4">
          <IonIcon icon={CloseIcon} className="svg-lg" />
        </button>

        {title && <p className="mb-5 font-headline2 text-gray8">{title}</p>}

        {children}

        <footer className="absolute bottom-[var(--ion-safe-area-bottom)] left-0 right-0 p-4 bg-white">
          <button
            className="w-full button-primary button-lg"
            disabled={buttonDisabled}
            onClick={() => {
              onClickButton?.();
              dismissModal();
            }}
          >
            {buttonText}
          </button>
        </footer>
      </div>
    </section>
  );
};
