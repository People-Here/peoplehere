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

import ArrowLeftIcon from '../../assets/svgs/arrow-left.svg';
import { getTourDetail } from '../../api/tour';
import useSignInStore from '../../stores/signIn';
import LogoRunning from '../../components/LogoRunning';
import TrashcanIcon from '../../assets/svgs/trashcan.svg';
import Footer from '../../layouts/Footer';
import Alert from '../../components/Alert';
import DeleteReason from '../../modals/DeleteReason';

import type { TourDetail } from '../../api/tour';

const ChangeStatus = () => {
  const router = useIonRouter();
  const location = useLocation();
  const region = useSignInStore((state) => state.region);

  const tourId = location.pathname.split('/').at(-1);

  const [tourInfo, setTourInfo] = useState<TourDetail>();
  const [active, setActive] = useState(false);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);

  useEffect(() => {
    if (!tourId) {
      return;
    }

    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    (async () => {
      const response = await getTourDetail(tourId, region.countryCode.toUpperCase(), 'ORIGIN');
      setTourInfo(response.data);

      setActive(response.data.available);
    })();
  }, [tourId, region.countryCode]);

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
                쪽지 받기
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
                새로운 쪽지 받지 않기
              </p>
            </div>
          </div>

          <div className="rounded-xl bg-gray1.5 p-4 w-full mt-4">
            <p className="font-body1 text-gray7">
              {active
                ? '장소에 [말 걸 수 있음] 상태를 표시하고, 새로운 사용자의 쪽지를 받습니다.'
                : '장소에 [쪽지 마감] 상태를 표시하고, 새로운 사용자의 쪽지를 받지 않습니다. 이미 대화가 시작된 사용자와는 계속해서 쪽지를 주고 받을 수 있습니다.'}
            </p>
          </div>
        </div>

        <Footer>
          <button className="w-full text-white button-primary button-lg font-subheading1">
            저장
          </button>
        </Footer>

        <Alert
          trigger="delete-tour-alert"
          title="장소를 삭제할까요?"
          subTitle={'삭제한 장소는 다시 복구할 수 없어요.'}
          buttons={[
            {
              text: '계속',
              onClick: () => setOpenDeleteModal(true),
            },
            {
              text: '취소',
            },
          ]}
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
