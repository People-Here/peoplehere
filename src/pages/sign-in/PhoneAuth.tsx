import { useState } from 'react';
import { IonModal, IonText, useIonRouter } from '@ionic/react';

import Header from '../../components/Header';
import LabelInput from '../../components/LabelInput';
import SelectInput from '../../components/SelectInput';
import SelectRegion from '../../modals/SelectRegion';
import useRegionStore from '../../stores/user';

const PhoneAuth = () => {
  const router = useIonRouter();
  const region = useRegionStore((state) => state.region);

  const [openModal, setOpenModal] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [authCode, setAuthCode] = useState('');

  return (
    <>
      <Header type="back" title="본인인증" />

      <div className="flex flex-col gap-2 px-4 mt-5">
        <SelectInput
          label="국가/지역"
          value={`${region.CountryNameKR} (+${String(region.ISONumbericCode).padStart(2, '0')})`}
          openModal={() => setOpenModal(true)}
        />

        <div className="flex items-center gap-2">
          <LabelInput label="전화번호" type="tel" value={phoneNumber} onChange={setPhoneNumber} />

          <button className="px-3 button-primary button-lg shrink-0" disabled={!phoneNumber.length}>
            <IonText className="text-white font-body1">인증코드 발송</IonText>
          </button>
        </div>

        <IonText
          className="pl-1 underline font-body1 text-gray5"
          onClick={() => router.push('/sign-in/email')}
        >
          전화번호 인증이 불가한가요?
        </IonText>

        <div className="mt-[2.875rem]">
          <IonText className="pl-1 font-body2 text-gray6">남은 시간 3:00</IonText>

          <div className="flex items-center gap-2 mt-2">
            <LabelInput label="인증번호 입력" value={authCode} onChange={setAuthCode} />

            <button
              className="px-3 w-[6.25rem] button-primary button-lg shrink-0"
              disabled={!authCode.length}
            >
              <IonText className="text-white font-body1">확인</IonText>
            </button>
          </div>
        </div>
      </div>

      <IonModal
        isOpen={openModal}
        initialBreakpoint={0.95}
        breakpoints={[0, 0.95]}
        onDidDismiss={() => setOpenModal(false)}
      >
        <SelectRegion closeModal={() => setOpenModal(false)} />
      </IonModal>
    </>
  );
};

export default PhoneAuth;
