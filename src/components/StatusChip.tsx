import { IonText, IonIcon } from '@ionic/react';
import { useTranslation } from 'react-i18next';

import MessageIcon from '../assets/svgs/message-line-color.svg';
import MessageBlockedIcon from '../assets/svgs/message-blocked.svg';

const StatusChip = ({ available }: { available?: boolean }) => {
  const { t } = useTranslation();

  return available ? (
    <div className="flex items-center gap-[5px] px-2 py-1 bg-orange1 rounded-[10px] w-fit">
      <IonText className="font-caption1 text-orange5">{t('post.onTag')}</IonText>
      <IonIcon icon={MessageIcon} className="svg-sm" />
    </div>
  ) : (
    <div className="flex items-center gap-[5px] px-2 py-1 bg-gray1.5 rounded-[10px] w-fit">
      <IonText className="font-caption1 text-gray6">{t('post.offTag')}</IonText>
      <IonIcon icon={MessageBlockedIcon} className="svg-sm" />
    </div>
  );
};

export default StatusChip;
