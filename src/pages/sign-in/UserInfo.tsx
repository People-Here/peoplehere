import { IonContent, IonText, useIonRouter } from '@ionic/react';
import { useRef, useState } from 'react';

import Header from '../../components/Header';
import Footer from '../../layouts/Footer';
import ProgressDots from '../../components/ProgressDots';
import LabelInput from '../../components/LabelInput';
import SelectInput from '../../components/SelectInput';
import DatePicker from '../../modals/DatePicker';
import SelectGender from '../../modals/SelectGender';
import PolicyAgreement from '../../modals/PolicyAgreement';
import useUserStore from '../../stores/userInfo';
import { signUp, type SignInRequest } from '../../api/sign-in';
import Toast from '../../toasts/Toast';
import { formatDataToString } from '../../utils/date';
import { GENDER } from '../../constants/gender';

const UserInfo = () => {
  const router = useIonRouter();
  const { phoneNumber, email, password, region } = useUserStore((state) => state);

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [birth, setBirth] = useState('');
  const [gender, setGender] = useState('');

  const [privacyChecked, setPrivacyChecked] = useState(false);
  const [marketingChecked, setMarketingChecked] = useState(false);

  const buttonRef = useRef<HTMLButtonElement>(null);

  const generateSignInData = (): SignInRequest => {
    return {
      firstName,
      lastName,
      birthDate: formatDataToString(birth),
      email,
      gender: GENDER[gender as '남성' | '여성' | '기타'],
      password,
      region: region['2digitCode'],
      phoneNumber,
      privacyConsent: privacyChecked,
      marketingConsent: marketingChecked,
    };
  };

  const userSignUp = async () => {
    const signInData = generateSignInData();

    const response = await signUp(signInData);

    if (response.status === 200) {
      router.push('/sign-in/alarm');
      return;
    }

    buttonRef.current?.click();
  };

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
            id="date-modal"
            label="생년월일(YYYY/MM/DD)"
            value={birth.split('T')[0].replaceAll('-', '/')}
          />
          <IonText className="pl-1 font-caption2 text-gray6">
            피플히어에 가입하려면 만 18세 이상이어야 해요.
          </IonText>
        </div>

        <SelectInput id="gender-modal" label="성별" value={gender} />

        <Footer>
          <button id="policy-modal" className="w-full button-primary button-lg">
            계속
          </button>
        </Footer>
      </div>

      {/* Modals */}
      <DatePicker trigger="date-modal" setDate={setBirth} />
      <SelectGender trigger="gender-modal" setGender={setGender} />
      <PolicyAgreement
        trigger="policy-modal"
        onClickButton={userSignUp}
        privacyChecked={privacyChecked}
        setPrivacyChecked={setPrivacyChecked}
        marketingChecked={marketingChecked}
        setMarketingChecked={setMarketingChecked}
      />

      <button id="error-toast" ref={buttonRef} type="button" className="hidden" />

      <Toast trigger="error-toast" type="error-small" message="회원가입에 실패했어요." />
    </IonContent>
  );
};

export default UserInfo;
