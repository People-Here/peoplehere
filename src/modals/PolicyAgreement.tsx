import { IonCheckbox } from '@ionic/react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

import colors from '../theme/colors';
import { FixedModalContainer } from '.';
import Checkbox from '../components/Checkbox';

import type { FixedModalProps } from '.';

type Props = {
  marketingChecked: boolean;
  setMarketingChecked: (checked: boolean) => void;
};

const PolicyAgreement = ({
  marketingChecked,
  setMarketingChecked,
  onClickButton,
  ...rest
}: Props & FixedModalProps) => {
  const { t, i18n } = useTranslation();

  return (
    <FixedModalContainer
      title={t('signup.policy.title')}
      buttonText={t('signup.policy.agree')}
      onClickButton={onClickButton}
      {...rest}
    >
      <div className="flex flex-col gap-4 mt-4">
        {/* <PolicyItem
          label={
            '마케팅 이메일을 수신하겠습니다. (선택)\n설정에서 언제든지 수신을 거부할 수 있습니다.'
          }
          checked={marketingChecked}
          setChecked={setMarketingChecked}
        /> */}
        <Checkbox
          checked={marketingChecked}
          onChange={setMarketingChecked}
          label={
            <label>
              <p className="font-caption2 text-gray7">{t('signup.policy.marketingAgreement1')}</p>
              <p className="font-caption2 text-gray5.5">{t('signup.policy.marketingAgreement2')}</p>
            </label>
          }
        />
      </div>

      <div className="px-3 py-2.5 rounded bg-gray1 mt-7 mb-3">
        {i18n.resolvedLanguage === 'ko' ? (
          <p className="font-caption2 text-gray6">
            {"'동의 및 완료'를 클릭함으로써 피플히어의 "}
            <Link to="/settings/policy/privacy" className="font-medium underline">
              서비스 약관
            </Link>
            ,{' '}
            <Link
              to={{
                pathname:
                  'https://juiceisworking.notion.site/f19ce16564ef4f1980e5aa9c777c5572?pvs=4',
              }}
              target="_blank"
              className="font-medium underline"
            >
              개인정보처리방침
            </Link>
            에 동의합니다.
          </p>
        ) : (
          <p className="font-caption2 text-gray6">
            {"By selecting Agree and sign up, I agree to Peoplehere's "}
            <Link to="/settings/policy/privacy" className="font-medium underline">
              Terms of service.
            </Link>
            ,{' '}
            <Link
              to={{
                pathname:
                  'https://juiceisworking.notion.site/f19ce16564ef4f1980e5aa9c777c5572?pvs=4',
              }}
              target="_blank"
              className="font-medium underline"
            >
              개인정보처리방침
            </Link>
          </p>
        )}
      </div>
    </FixedModalContainer>
  );
};

type ItemProps = {
  label: string;
  checked: boolean;
  setChecked: (checked: boolean) => void;
};

const PolicyItem = ({ label, checked = false, setChecked }: ItemProps) => {
  return (
    <IonCheckbox
      class="ion-no-margin"
      justify="space-between"
      checked={checked}
      onIonChange={(e) => setChecked(e.detail.checked)}
      style={{
        '--size': '18px',
        '--checkbox-background': colors.gray3,
        '--checkbox-background-checked': colors.orange5,
        '--border-width': 0,
      }}
    >
      <p className="whitespace-pre-line font-caption2 text-gray7">{label}</p>
    </IonCheckbox>
  );
};

export default PolicyAgreement;
