import { IonCheckbox } from '@ionic/react';
import { useTranslation } from 'react-i18next';

import colors from '../theme/colors';
import ModalContainer from '.';
import Checkbox from '../components/Checkbox';

import type { ModalProps } from '.';

type Props = {
  marketingChecked: boolean;
  setMarketingChecked: (checked: boolean) => void;
};

const PolicyAgreement = ({
  marketingChecked,
  setMarketingChecked,
  onClickButton,
  ...rest
}: Props & ModalProps) => {
  const { t } = useTranslation();

  return (
    <ModalContainer
      title={t('signup.policy.title')}
      buttonText={t('signup.policy.agree')}
      initialBreakpoint={0.35}
      breakpoints={[0, 0.35, 0.4]}
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
        <p className="font-caption2 text-gray6">{t('signup.policy.confirmText')}</p>
      </div>
    </ModalContainer>
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
