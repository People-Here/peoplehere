import { useRef, useState } from 'react';
import { IonButtons, IonContent, IonIcon, IonModal, IonTitle, IonToolbar } from '@ionic/react';
import { useTranslation } from 'react-i18next';
import { FirebaseAnalytics } from '@capacitor-community/firebase-analytics';

import CloseIcon from '../assets/svgs/close.svg';
import Footer from '../layouts/Footer';
import Alert from '../components/Alert';
import { postMessage } from '../api/message';
import { getNewToken } from '../api/login';
import useLogin from '../hooks/useLogin';

import type { AxiosError } from 'axios';
import type { ModalProps } from '.';

type Props = {
  tourId: string;
  tourTitle: string;
  receiverId: string;
  receiverName: string;
};

const SendMessage = ({
  tourId,
  tourTitle,
  receiverId,
  receiverName,
  ...rest
}: Props & ModalProps) => {
  const { t } = useTranslation();

  const { checkLogin } = useLogin();

  // eslint-disable-next-line no-undef
  const modalRef = useRef<HTMLIonModalElement>(null);

  const [input, setInput] = useState('');

  const sendMessage = async () => {
    const isLoggedIn = await checkLogin();
    if (!isLoggedIn) return;

    try {
      await postMessage({
        tourId,
        receiverId,
        message: input,
      });
      await FirebaseAnalytics.logEvent({
        name: 'complete_send_complete',
        params: {
          message_time: new Date().toLocaleString(),
        },
      });
      await modalRef.current?.dismiss();
    } catch (error) {
      const errorInstance = error as AxiosError;

      if (errorInstance.response?.status === 403) {
        await getNewToken();

        await postMessage({
          tourId,
          receiverId,
          message: input,
        });
        await modalRef.current?.dismiss();
      }

      if (errorInstance.response?.status === 404) {
        console.error('유효하지 않은 요청입니다.', error);
      }

      if (errorInstance.response?.status === 500) {
        console.error('server error', error);
      }
    } finally {
      setInput('');
    }
  };

  const logToGA = async () => {
    await FirebaseAnalytics.logEvent({
      name: 'post_send',
      params: {},
    });

    await FirebaseAnalytics.setUserProperty({
      name: 'message_post_title',
      value: tourTitle,
    });
  };

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
              To. {receiverName}
            </IonTitle>
          </IonToolbar>

          <div className="px-4 mt-3">
            <textarea
              value={input}
              onChange={(e) => setInput(e.currentTarget.value)}
              className="w-full border border-gray3 rounded-lg bg-gray1.5 px-4 py-2.5 min-h-60 font-body1 text-gray8"
            />
          </div>

          <Footer>
            <button
              id="send-confirm-alert"
              className="w-full mb-4 button-primary button-lg"
              disabled={input.length === 0}
            >
              {t('draft.send')}
            </button>
          </Footer>
        </IonContent>

        <Alert
          trigger="send-confirm-alert"
          title={t('draft.p1')}
          buttons={[
            {
              text: t('progress.cancel'),
            },
            {
              text: t('draft.send'),
              onClick: async () => {
                await sendMessage();
                await logToGA();
              },
            },
          ]}
        />
      </IonModal>
    </>
  );
};

export default SendMessage;
