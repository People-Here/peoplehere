import { useState } from 'react';
import { IonIcon } from '@ionic/react';
import { useTranslation } from 'react-i18next';
import { FirebaseAnalytics } from '@capacitor-community/firebase-analytics';

import { FixedModalContainer } from '.';
import CheckIcon from '../assets/svgs/check.svg';

import type { FixedModalProps } from '.';

type Props = {
  onConfirm: () => void;
  setReason: (reason: string) => void;
};

const DeleteUser = (props: Props & FixedModalProps) => {
  const { t } = useTranslation();

  const [clickedItem, setClickedItem] = useState('');

  const options = [
    t('deleteAccount.option1'),
    t('deleteAccount.option2'),
    t('deleteAccount.option3'),
  ];

  return (
    <FixedModalContainer
      title={t('deleteAccount.title')}
      buttonText={t('progress.next')}
      onClickButton={async () => {
        await FirebaseAnalytics.logEvent({
          name: 'click_delete_account_next',
          params: {},
        });

        if (clickedItem) {
          props.setReason(clickedItem);
          props.onConfirm();
        }
      }}
      buttonDisabled={!clickedItem}
      {...props}
    >
      <div>
        <p className="mb-4 font-body2 text-gray6">{t('deleteAccount.detail')}</p>

        <div className="mb-2">
          {options.map((option) => (
            <OptionItem
              key={option}
              title={option}
              onClick={() => setClickedItem(option)}
              clicked={clickedItem === option}
            />
          ))}
        </div>
      </div>
    </FixedModalContainer>
  );
};

type OptionItemProps = {
  title: string;
  onClick: () => void;
  clicked?: boolean;
};
const OptionItem = ({ title, onClick, clicked }: OptionItemProps) => {
  return (
    <div className="flex items-center justify-between px-3 py-4" onClick={onClick}>
      <p className={clicked ? 'font-body1 text-orange6' : 'font-body1 text-gray8'}>{title}</p>
      {clicked && <IonIcon icon={CheckIcon} className="svg-md" />}
    </div>
  );
};

export default DeleteUser;
