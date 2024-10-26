import { IonButtons, IonContent, IonIcon, IonModal, IonTitle, IonToolbar } from '@ionic/react';
import { useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';

import CloseIcon from '../assets/svgs/close.svg';
import Footer from '../layouts/Footer';
import { reportUser } from '../api/report';

import type { ModalProps } from '.';

type Props = {
  userId: string;
  userName: string;
};

const ReportUser = ({ userId, userName, ...rest }: Props & ModalProps) => {
  const { t } = useTranslation();

  // eslint-disable-next-line no-undef
  const modalRef = useRef<HTMLIonModalElement>(null);

  const [input, setInput] = useState('');

  const onClickReport = async () => {
    if (!input.trim()) return;

    try {
      await reportUser({ userId, message: input });
      await modalRef.current?.dismiss();
    } catch (error) {
      console.error('fail to report user', error);
    }
  };

  return (
    <IonModal ref={modalRef} isOpen={rest.isOpen} {...rest}>
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
            {userName}
          </IonTitle>
        </IonToolbar>

        <div className="px-4">
          <p className="mt-5 font-headline1 text-gray8">{t('profile.reportTitle')}</p>

          <p className="mt-1.5 font-body1 text-gray5 whitespace-pre-wrap">
            {t('profile.reportDescription')}
          </p>

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
            onClick={onClickReport}
          >
            {t('progress.report')}
          </button>
        </Footer>
      </IonContent>
    </IonModal>
  );
};

export default ReportUser;
