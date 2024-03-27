import { useState } from 'react';
import LabelInput from '../../components/LabelInput';
import SelectInput from '../../components/SelectInput';
import { IonText } from '@ionic/react';
import Header from '../../components/Header';

const PhoneAuth = () => {
  const [phoneNumber, setPhoneNumber] = useState('');

  return (
    <>
      <Header type="back" title="본인인증" />

      <div className="flex flex-col gap-2 px-4">
        <SelectInput label="국가/지역" value="대한민국 (+82)" />

        <div className="flex items-center justify-between">
          <LabelInput label="전화번호" value={phoneNumber} onChange={setPhoneNumber} />

          <button className="px-3 button-primary button-lg">
            <IonText className="text-white font-body1">인증코드 발송</IonText>
          </button>
        </div>

        <IonText className="pl-1 underline font-body1 text-gray5">
          전화번호 인증이 불가한가요?
        </IonText>
      </div>
    </>
  );
};

export default PhoneAuth;
