import { useState } from 'react';
import CloseHeader from '../../components/CloseHeader';
import LabelInput from '../../components/LabelInput';
import SelectInput from '../../components/SelectInput';
import { IonText } from '@ionic/react';

const PhoneAuth = () => {
  const [phoneNumber, setPhoneNumber] = useState('');

  return (
    <>
      <CloseHeader />

      <div className="flex flex-col gap-2 px-4">
        <SelectInput label="국가/지역" value="대한민국 (+82)" />

        <div className="flex items-center justify-between">
          <LabelInput label="전화번호" value={phoneNumber} onChange={setPhoneNumber} />

          <button className="px-3 button-primary button-lg">인증코드 발송</button>
        </div>

        <IonText className="pl-1 underline font-body1 text-gray5">
          전화번호 인증이 불가한가요?
        </IonText>
      </div>
    </>
  );
};

export default PhoneAuth;
