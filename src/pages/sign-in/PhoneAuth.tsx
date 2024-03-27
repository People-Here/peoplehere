import { useState } from 'react';
import { IonModal, IonText } from '@ionic/react';

import Header from '../../components/Header';
import LabelInput from '../../components/LabelInput';
import SelectInput from '../../components/SelectInput';
import SelectRegion from '../../modals/SelectRegion';
import useRegionStore from '../../stores/user';

const PhoneAuth = () => {
  const region = useRegionStore((state) => state.region);

  console.log('region', region);

  const [phoneNumber, setPhoneNumber] = useState('');
  const [openModal, setOpenModal] = useState(false);

  return (
    <>
      <Header type="back" title="본인인증" />

      <div className="flex flex-col gap-2 px-4 mt-5">
        <SelectInput
          label="국가/지역"
          value={`${region['2digitCode']} (+${String(region.ISONumbericCode).padStart(2, '0')})`}
          openModal={() => setOpenModal(true)}
        />

        <div className="flex items-center gap-2">
          <LabelInput label="전화번호" type="tel" value={phoneNumber} onChange={setPhoneNumber} />

          <button className="px-3 button-primary button-lg shrink-0" disabled={!phoneNumber.length}>
            <IonText className="text-white font-body1">인증코드 발송</IonText>
          </button>
        </div>

        <IonText className="pl-1 underline font-body1 text-gray5">
          전화번호 인증이 불가한가요?
        </IonText>
      </div>

      <IonModal isOpen={openModal} initialBreakpoint={0.95} breakpoints={[0, 0.95]}>
        <SelectRegion closeModal={() => setOpenModal(false)} />
      </IonModal>
    </>
  );
};

export default PhoneAuth;
