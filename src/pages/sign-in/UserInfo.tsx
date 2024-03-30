import { IonContent, IonModal, IonText } from '@ionic/react';
import { useState } from 'react';

import Header from '../../components/Header';
import Footer from '../../layouts/Footer';
import ProgressDots from '../../components/ProgressDots';
import LabelInput from '../../components/LabelInput';
import SelectInput from '../../components/SelectInput';
import DatePicker from '../../modals/DatePicker';
import SelectGender from '../../modals/SelectGender';
import PolicyAgreement from '../../modals/PolicyAgreement';

const UserInfo = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');

  const [birth, setBirth] = useState('');
  const [gender, setGender] = useState('');

  const [openDateModal, setOpenDateModal] = useState(false);
  const [openGenderModal, setOpenGenderModal] = useState(false);

  return (
    <IonContent className="relative h-full">
      <Header type="back" />

      <div className="px-4 mt-5">
        <ProgressDots total={3} current={3} />
        <h1 className="font-headline1 text-[#1D1B20] whitespace-pre-wrap mt-3">
          {'마지막으로\n회원가입을 위한 정보를 알려주세요'}
        </h1>

        <div className="flex flex-col gap-2 mt-5 mb-9">
          <LabelInput label="이름 (예: 길동)" value={firstName} onChange={setFirstName} />
          <LabelInput label="성 (예: 홍)" value={lastName} onChange={setLastName} />
        </div>

        <div className="flex flex-col gap-2 mb-9">
          <SelectInput
            label="생년월일(YYYY/MM/DD)"
            value={birth.split('T')[0].replaceAll('-', '/')}
            openModal={() => setOpenDateModal(true)}
          />
          <IonText className="pl-1 font-caption2 text-gray6">
            피플히어에 가입하려면 만 18세 이상이어야 해요.
          </IonText>
        </div>

        <SelectInput label="성별" value={gender} openModal={() => setOpenGenderModal(true)} />

        <Footer>
          <button id="policy-modal" className="w-full button-primary button-lg">
            계속
          </button>
        </Footer>
      </div>

      <IonModal
        isOpen={openDateModal}
        initialBreakpoint={0.45}
        breakpoints={[0, 0.45]}
        onDidDismiss={() => setOpenDateModal(false)}
      >
        <DatePicker setDate={setBirth} closeModal={() => setOpenDateModal(false)} />
      </IonModal>

      <IonModal
        isOpen={openGenderModal}
        initialBreakpoint={0.4}
        breakpoints={[0, 0.4]}
        onDidDismiss={() => setOpenGenderModal(false)}
      >
        <SelectGender setGender={setGender} closeModal={() => setOpenGenderModal(false)} />
      </IonModal>

      <IonModal trigger="policy-modal" initialBreakpoint={0.4} breakpoints={[0, 0.4]}>
        <PolicyAgreement />
      </IonModal>
    </IonContent>
  );
};

export default UserInfo;
