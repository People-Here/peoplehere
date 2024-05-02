import { IonContent, IonText, useIonRouter } from '@ionic/react';
import { useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';

import Header from '../../components/Header';
import Footer from '../../layouts/Footer';
import ProgressDots from '../../components/ProgressDots';
import LabelInput from '../../components/LabelInput';
import SelectInput from '../../components/SelectInput';
import DatePicker from '../../modals/DatePicker';
import SelectGender from '../../modals/SelectGender';
import PolicyAgreement from '../../modals/PolicyAgreement';
import useSignInStore from '../../stores/signIn';
import { signUp, type SignInRequest } from '../../api/sign-up';
import Toast from '../../toasts/Toast';
import { formatDataToString } from '../../utils/date';
import { GENDER } from '../../constants/gender';

const UserInfo = () => {
  const { t } = useTranslation();

  const router = useIonRouter();
  const { phoneNumber, email, password, region, clearSignInInfo } = useSignInStore(
    (state) => state,
  );

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [birth, setBirth] = useState('');
  const [gender, setGender] = useState('');

  const [marketingChecked, setMarketingChecked] = useState(false);

  const buttonRef = useRef<HTMLButtonElement>(null);

  const generateSignInData = (): SignInRequest => {
    return {
      firstName,
      lastName,
      birthDate: formatDataToString(birth),
      email,
      gender,
      password,
      region: region.countryCode,
      phoneNumber,
      privacyConsent: true,
      marketingConsent: marketingChecked,
    };
  };

  const userSignUp = async () => {
    const signInData = generateSignInData();

    const response = await signUp(signInData);

    if (response.status === 200) {
      clearSignInInfo();
      router.push('/sign-up/alarm');
      return;
    }

    buttonRef.current?.click();
  };

  return (
    <IonContent fullscreen className="relative">
      <Header type="back" />

      <div className="px-4 mt-5">
        <ProgressDots total={3} current={3} />
        <h1 className="font-headline1 text-[#1D1B20] whitespace-pre-wrap mt-3">
          {t('signup.info.title')}
        </h1>

        <div className="flex flex-col gap-2 mt-5 mb-9">
          <LabelInput
            label={t('signup.info.firstName')}
            value={firstName}
            onChange={setFirstName}
          />
          <LabelInput label={t('signup.info.lastName')} value={lastName} onChange={setLastName} />
        </div>

        <div className="flex flex-col gap-2 mb-9">
          <SelectInput
            id="date-modal"
            label={t('signup.info.birthDay')}
            value={birth.split('T')[0].replaceAll('-', '/')}
          />
          <IonText className="pl-1 font-caption2 text-gray6">{t('signup.info.ageLimit')}</IonText>
        </div>

        <SelectInput
          id="gender-modal"
          label={t('signup.info.gender')}
          value={GENDER[gender as keyof typeof GENDER]}
        />

        <Footer>
          <button id="policy-modal" className="w-full button-primary button-lg">
            {t('common.continue')}
          </button>
        </Footer>
      </div>

      {/* Modals */}
      <DatePicker trigger="date-modal" setDate={setBirth} />
      <SelectGender trigger="gender-modal" setGender={setGender} />
      <PolicyAgreement
        trigger="policy-modal"
        onClickButton={userSignUp}
        marketingChecked={marketingChecked}
        setMarketingChecked={setMarketingChecked}
      />

      <button id="error-toast" ref={buttonRef} type="button" className="hidden" />

      <Toast trigger="error-toast" type="error-small" message="회원가입에 실패했어요." />
    </IonContent>
  );
};

export default UserInfo;
