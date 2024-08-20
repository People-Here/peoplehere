import {
  IonButtons,
  IonContent,
  IonIcon,
  IonPage,
  IonTitle,
  IonToolbar,
  useIonRouter,
} from '@ionic/react';
import { useLocation } from 'react-router';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import ArrowLeftIcon from '../../assets/svgs/arrow-left.svg';
import { getTourDetail } from '../../api/tour';
import useSignInStore from '../../stores/signIn';
import LogoRunning from '../../components/LogoRunning';
import TrashcanIcon from '../../assets/svgs/trashcan.svg';
import Footer from '../../layouts/Footer';
import Alert from '../../components/Alert';
import DeleteReason from '../../modals/DeleteReason';
import { changeMessageReceiveStatus } from '../../api/message';

import type { TourDetail } from '../../api/tour';

const ChangeStatus = () => {
  const { t } = useTranslation();
  const router = useIonRouter();
  const location = useLocation();
  const region = useSignInStore((state) => state.region);

  const tourId = location.pathname.split('/').at(-1);

  const [tourInfo, setTourInfo] = useState<TourDetail>();
  const [active, setActive] = useState(false);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [showChangeCompleteAlert, setShowChangeCompleteAlert] = useState(false);

  useEffect(() => {
    if (!tourId) {
      return;
    }

    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    (async () => {
      const response = await getTourDetail(tourId, region.countryCode.toUpperCase(), 'ORIGIN');
      setTourInfo(response.data);

      setActive(response.data.directMessageStatus);
    })();
  }, [tourId, region.countryCode]);

  const onClickSave = async () => {
    if (!tourId) return;

    try {
      await changeMessageReceiveStatus(tourId, active);
      setShowChangeCompleteAlert(true);
      const response = await getTourDetail(tourId, region.countryCode.toUpperCase(), 'ORIGIN');
      setTourInfo(response.data);
    } catch (error) {
      console.error('fail to save status', error);
    }
  };

  if (!tourInfo) {
    return <LogoRunning />;
  }

  return (
    <IonPage>
      <IonContent fullscreen>
        {/* header */}
        <IonToolbar className="px-4 h-14">
          <IonButtons slot="start">
            <IonIcon src={ArrowLeftIcon} className="svg-lg" onClick={() => router.goBack()} />
          </IonButtons>

          <IonTitle class="ion-text-center" className="font-headline3 text-gray8">
            {tourInfo.title}
          </IonTitle>

          <IonButtons slot="end">
            <IonIcon id="delete-tour-alert" src={TrashcanIcon} className="svg-lg" />
          </IonButtons>
        </IonToolbar>

        <div className="px-4 mt-4">
          <div
            className="w-full flex items-center bg-gray1.5 rounded-xl"
            onClick={() => setActive((prev) => !prev)}
          >
            <div
              className={
                active
                  ? 'flex items-center justify-center w-full bg-white rounded-xl border border-orange3 py-2.5'
                  : 'flex items-center justify-center w-full'
              }
            >
              <p className={active ? 'font-body1 text-orange5' : 'font-body1 text-gray5'}>
                {t('managePost.messageOn')}
              </p>
            </div>

            <div
              className={
                !active
                  ? 'flex items-center justify-center w-full bg-white rounded-xl border border-orange3 py-2.5'
                  : 'flex items-center justify-center w-full'
              }
            >
              <p className={!active ? 'font-body1 text-orange5' : 'font-body1 text-gray5'}>
                {t('managePost.messageOff')}
              </p>
            </div>
          </div>

          <div className="rounded-xl bg-gray1.5 p-4 w-full mt-4">
            <p className="font-body1 text-gray7">
              {active ? t('managePost.onDetail') : t('managePost.offDetail')}
            </p>
          </div>
        </div>

        <Footer>
          <button
            className="w-full text-white button-primary button-lg font-subheading1"
            onClick={onClickSave}
            disabled={active === tourInfo.directMessageStatus}
          >
            {t('progress.save')}
          </button>
        </Footer>

        <Alert
          trigger="delete-tour-alert"
          title={t('deletePost.p1')}
          subTitle={t('deletePost.p2')}
          buttons={[
            {
              text: t('progress.continue'),
              onClick: () => setOpenDeleteModal(true),
            },
            {
              text: t('progress.cancel'),
            },
          ]}
        />

        <Alert
          isOpen={showChangeCompleteAlert}
          onDismiss={() => setShowChangeCompleteAlert(false)}
          title={t('managePost.status')}
          buttons={[{ text: '확인' }]}
        />

        <DeleteReason
          tourId={tourId ?? ''}
          title={tourInfo.title}
          isOpen={openDeleteModal}
          onDidDismiss={() => setOpenDeleteModal(false)}
        />
      </IonContent>
    </IonPage>
  );
};

export default ChangeStatus;
