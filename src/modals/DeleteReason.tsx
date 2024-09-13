import {
  IonButtons,
  IonContent,
  IonIcon,
  IonModal,
  IonTitle,
  IonToolbar,
  useIonRouter,
} from '@ionic/react';
import { useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FirebaseAnalytics } from '@capacitor-community/firebase-analytics';

import Footer from '../layouts/Footer';
import { getNewToken } from '../api/login';
import { deleteTour } from '../api/tour';
import CloseIcon from '../assets/svgs/close.svg';

import type { ModalProps } from '.';
import type { AxiosError } from 'axios';

type Props = {
  tourId: string;
  title: string;
};

const DeleteReason = ({ tourId, title, isOpen, ...rest }: Props & ModalProps) => {
  const { t } = useTranslation();

  // eslint-disable-next-line no-undef
  const modalRef = useRef<HTMLIonModalElement>(null);

  const router = useIonRouter();

  const [input, setInput] = useState('');

  const onDeleteTour = async (tourId: string) => {
    if (!input.trim()) return;

    try {
      await deleteTour(tourId, input);
      await FirebaseAnalytics.logEvent({
        name: 'delete_post_complete',
        params: {},
      });
      router.push('/profile');
    } catch (error) {
      const errorInstance = error as AxiosError;

      if (errorInstance.response?.status === 403) {
        await getNewToken();

        await deleteTour(tourId, input);
        await FirebaseAnalytics.logEvent({
          name: 'delete_post_complete',
          params: {},
        });
        router.push('/profile');
      }
      console.error('fail to delete tour', error);
    }
  };

  return (
    <IonModal ref={modalRef} isOpen={isOpen} {...rest}>
      <IonContent fullscreen>
        <IonToolbar className="px-4 h-14">
          <IonButtons slot="start">
            <IonIcon
              src={CloseIcon}
              className="svg-lg"
              onClick={() => modalRef.current?.dismiss()}
            />
          </IonButtons>

          <IonTitle class="ion-text-center" className="font-headline3 text-gray8">
            {title}
          </IonTitle>
        </IonToolbar>

        <div className="px-4">
          <p className="mt-5 font-headline1 text-gray8">{t('deletePost.feedback')}</p>

          <div className="flex gap-1.5 flex-col items-end mt-6">
            <textarea
              className="px-4 py-2.5 rounded-lg bg-gray1.5 border border-gray3 min-h-[8.75rem] font-body1 text-gray8 resize-none w-full"
              value={input}
              onChange={(e) => setInput(e.currentTarget.value)}
              maxLength={500}
            />

            <p className="font-caption2 text-gray5">{input.length}/500</p>
          </div>
        </div>

        <Footer>
          <button
            className="w-full mb-4 text-white button-primary button-lg font-subheading1"
            disabled={input.trim().length <= 0}
            onClick={() => onDeleteTour(tourId)}
          >
            {t('deletePost.confirm')}
          </button>
        </Footer>
      </IonContent>
    </IonModal>
  );
};

export default DeleteReason;
