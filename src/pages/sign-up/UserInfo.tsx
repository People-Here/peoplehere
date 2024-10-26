import { IonContent, IonText, useIonRouter } from '@ionic/react';
import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FirebaseAnalytics } from '@capacitor-community/firebase-analytics';

import Header from '../../components/Header';
import Footer from '../../layouts/Footer';
import ProgressDots from '../../components/ProgressDots';
import LabelInput from '../../components/LabelInput';
import SelectInput from '../../components/SelectInput';
import DatePicker from '../../modals/DatePicker';
import SelectGender from '../../modals/SelectGender';
import PolicyAgreement from '../../modals/PolicyAgreement';
import useSignInStore from '../../stores/signIn';
import { GENDER } from '../../constants/gender';
import { capitalizeFirstLetter } from '../../utils/mask';
import Toast from '../../toasts/Toast';

const UserInfo = () => {
  const { t, i18n } = useTranslation();

  const router = useIonRouter();
  const {
    setFirstName: storeFirstName,
    setLastName: storeLastName,
    setBirthDate: storeBirthDate,
    setGender: storeGender,
    setPolicyConsent: storePolicyConsent,
  } = useSignInStore((state) => state);

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [birth, setBirth] = useState('');
  const [gender, setGender] = useState('');
  const [ageError, setAgeError] = useState('');

  const [showBirthInput, setShowBirthInput] = useState(false);
  const [showGenderInput, setShowGenderInput] = useState(false);

  const [openBirthModal, setOpenBirthModal] = useState(false);
  const [openGenderModal, setOpenGenderModal] = useState(false);
  const [openPolicyModal, setOpenPolicyModal] = useState(false);

  const [marketingChecked, setMarketingChecked] = useState(false);

  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (firstName && lastName) {
      setShowBirthInput(true);
    }
  }, [firstName, lastName]);

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    FirebaseAnalytics.setScreenName({
      screenName: 'signup_info',
      nameOverride: 'SignupInfo',
    });
  }, []);

  const onClickNext = async () => {
    if (Number(birth.slice(0, 4)) > new Date().getFullYear() - 18) {
      setAgeError(t('signup.ageLimit'));
      return;
    }

    if (!firstName || !lastName || !birth || !gender) {
      console.error('회원가입 정보를 모두 입력해주세요.');
      return;
    }

    storeFirstName(firstName);
    storeLastName(lastName);
    storeBirthDate(birth);
    storeGender(gender as 'MALE' | 'FEMALE' | 'OTHER');
    storePolicyConsent({ privacy: true, marketing: marketingChecked });

    router.push('/sign-up/alarm');

    await FirebaseAnalytics.logEvent({
      name: 'click_agree_policy',
      params: {
        marketing_agreement: marketingChecked ? 'Yes' : 'No',
      },
    });
  };

  return (
    <IonContent fullscreen className="relative">
      <Header type="back" />

      <div className="px-4 mt-5">
        <ProgressDots total={3} current={3} />
        <h1 className="font-headline1 text-[#1D1B20] whitespace-pre-wrap mt-3">
          {t('signup.title')}
        </h1>

        <div className="flex flex-col gap-2 mt-5 mb-9">
          <LabelInput label={t('signup.firstName')} value={firstName} onChange={setFirstName} />
          <LabelInput label={t('signup.lastName')} value={lastName} onChange={setLastName} />
        </div>

        {showBirthInput && (
          <div
            className="flex flex-col gap-2 mb-9 animate-fade-down"
            onClick={() => {
              setOpenBirthModal(true);
              setAgeError('');
            }}
          >
            <SelectInput
              label={t('signup.birthday')}
              value={birth.split('T')[0].replaceAll('-', '/')}
            />
            {ageError && <IonText className="pl-1 font-caption2 text-red3">{ageError}</IonText>}
            <IonText className="pl-1 font-caption2 text-gray6">{t('signup.ageLimit')}</IonText>
          </div>
        )}

        {showBirthInput && showGenderInput && (
          <div className="animate-fade-down" onClick={() => setOpenGenderModal(true)}>
            <SelectInput
              label={t('signup.gender')}
              value={
                i18n.resolvedLanguage === 'ko'
                  ? GENDER[gender as keyof typeof GENDER]
                  : capitalizeFirstLetter(gender)
              }
            />
          </div>
        )}

        <Footer>
          <button
            className="w-full button-primary button-lg"
            disabled={!firstName || !lastName || !birth || !gender}
            onClick={async () => {
              setOpenPolicyModal(true);
              await FirebaseAnalytics.logEvent({
                name: 'click_signup_info',
                params: {},
              });
            }}
          >
            {t('progress.next')}
          </button>
        </Footer>
      </div>

      {/* Modals */}
      <DatePicker
        isOpen={openBirthModal}
        closeModal={() => setOpenBirthModal(false)}
        setDate={setBirth}
        onClickButton={() => setShowGenderInput(true)}
      />
      <SelectGender
        isOpen={openGenderModal}
        closeModal={() => setOpenGenderModal(false)}
        setGender={setGender}
        onClickButton={() => setOpenGenderModal(false)}
      />
      <PolicyAgreement
        isOpen={openPolicyModal}
        closeModal={() => setOpenPolicyModal(false)}
        onClickButton={onClickNext}
        marketingChecked={marketingChecked}
        setMarketingChecked={setMarketingChecked}
      />

      <button id="error-toast" ref={buttonRef} type="button" className="hidden" />

      <Toast trigger="error-toast" type="error-small" message="회원가입에 실패했어요." />
    </IonContent>
  );
};

export default UserInfo;
