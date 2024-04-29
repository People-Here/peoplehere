import { useRef, useState } from 'react';
import { IonButtons, IonContent, IonIcon, IonModal, IonTitle, IonToolbar } from '@ionic/react';

import CloseIcon from '../assets/svgs/close.svg';
import Footer from '../layouts/Footer';
import Alert from '../components/Alert';

import type { ModalProps } from '.';

type Props = {
  sendMessage: () => void;
};

const SendMessage = ({ sendMessage, ...rest }: Props & ModalProps) => {
  // eslint-disable-next-line no-undef
  const modalRef = useRef<HTMLIonModalElement>(null);

  const [input, setInput] = useState('');

  return (
    <>
      <IonModal ref={modalRef} {...rest}>
        <IonContent fullscreen>
          <IonToolbar className="px-4 h-14">
            <IonButtons slot="start">
              <IonIcon
                icon={CloseIcon}
                className="svg-lg"
                onClick={() => modalRef.current?.dismiss()}
              />
            </IonButtons>

            <IonTitle class="ion-text-center" className="font-headline3 text-gray8">
              쪽지 작성
            </IonTitle>
          </IonToolbar>

          <div className="px-4 mt-3">
            <textarea
              value={input}
              onChange={(e) => setInput(e.currentTarget.value)}
              placeholder="내용을 입력하세요."
              className="w-full border border-gray3 rounded-lg bg-gray1.5 px-4 py-2.5 min-h-60 font-body1 text-gray8"
            />
          </div>

          <Footer>
            <button id="send-confirm-alert" className="w-full mb-4 button-primary button-lg">
              전송하기
            </button>
          </Footer>
        </IonContent>
        <Alert
          trigger="send-confirm-alert"
          title="쪽지를 전송할까요?"
          buttons={[
            {
              text: '취소',
            },
            {
              text: '전송',
            },
          ]}
        />
      </IonModal>
    </>
  );
};

export default SendMessage;
