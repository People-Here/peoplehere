import { IonCheckbox, IonIcon, IonItem, IonText } from '@ionic/react';

import CloseIcon from '../assets/svgs/close.svg';
import colors from '../theme/colors';

const PolicyAgreement = () => {
  return (
    <div className="relative p-4 pt-10 mb-28">
      <IonIcon className="absolute svg-lg stroke-gray7 top-4 right-4" src={CloseIcon} />

      <IonText className="mb-5 font-headline2 text-gray8">약관 동의</IonText>

      <div className="flex flex-col gap-4 mt-4">
        <PolicyItem
          label={
            '개인정보 수집 및 이용에 동의합니다.\n피플히어가 수집하는 개인정보를 보려면 클릭하세요.'
          }
        />
        <PolicyItem
          label={
            '마케팅 이메일을 수신하겠습니다. (선택)\n설정에서 언제든지 수신을 거부할 수 있습니다.'
          }
        />
      </div>

      <div className="px-3 py-2.5 rounded bg-gray1 mt-3">
        <IonText className="font-caption2 text-gray6">
          아래 버튼을 클릭함으로써 피플히어의 서비스 약관, 위치기반서비스 이용 약관,
          개인정보처리방침에 동의합니다.
        </IonText>
      </div>

      <button className="w-full mt-3 button-primary button-lg">회원가입 완료</button>
    </div>
  );
};

type ItemProps = {
  label: string;
  checked?: boolean;
};
const PolicyItem = ({ label, checked = false }: ItemProps) => {
  return (
    <IonCheckbox
      class="ion-no-margin"
      justify="space-between"
      style={{
        '--size': '18px',
        '--checkbox-background': colors.gray3,
        '--checkbox-background-checked': colors.orange5,
        '--border-width': 0,
      }}
    >
      <IonText class="ion-no-margin" className="whitespace-pre-line font-caption2 text-gray7">
        {label}
      </IonText>
    </IonCheckbox>
  );
};

export default PolicyAgreement;