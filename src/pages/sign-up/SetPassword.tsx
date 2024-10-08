import { useEffect, useState } from 'react';
import { IonContent, useIonRouter } from '@ionic/react';
import { useTranslation } from 'react-i18next';
import { FirebaseAnalytics } from '@capacitor-community/firebase-analytics';

import Header from '../../components/Header';
import LabelInput from '../../components/LabelInput';
import ProgressDots from '../../components/ProgressDots';
import PasswordValidator from '../../components/PasswordValidator';
import Footer from '../../layouts/Footer';
import { PASSWORD_VALIDATION } from '../../constants/regex';
import PasswordInput from '../../components/PasswordInput';
import useSignInStore from '../../stores/signIn';

const SetPassword = () => {
  const { t } = useTranslation();

  const router = useIonRouter();
  const { email, setPassword } = useSignInStore((state) => state);

  const [passwordInput, setPasswordInput] = useState('');

  const isPasswordValid =
    PASSWORD_VALIDATION.moreThan8.test(passwordInput) &&
    PASSWORD_VALIDATION.hasSpecialCharOrNumber.test(passwordInput);

  const onClickNext = async () => {
    await FirebaseAnalytics.logEvent({
      name: 'click_set_password',
      params: {},
    });

    setPassword(passwordInput);
    router.push('/sign-up/info');
  };

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    FirebaseAnalytics.setScreenName({
      screenName: 'set_password',
      nameOverride: 'SetPassword',
    });
  }, []);

  return (
    <IonContent fullscreen className="relative">
      <Header type="back" />

      <div className="px-4 mt-5">
        <ProgressDots total={3} current={2} />
        <h1 className="font-headline1 text-[#1D1B20] whitespace-pre-wrap mt-3">
          {t('loginInfo.password')}
        </h1>

        <div className="flex flex-col gap-2 mt-5">
          <LabelInput label={t('user.email')} value={email} onChange={() => {}} readonly disabled />

          <PasswordInput value={passwordInput} onChange={setPasswordInput} />
          <PasswordValidator password={passwordInput} />
        </div>
      </div>

      <Footer>
        <button
          className="w-full button-primary button-lg"
          disabled={!isPasswordValid}
          onClick={onClickNext}
        >
          {t('progress.next')}
        </button>
      </Footer>
    </IonContent>
  );
};

export default SetPassword;
