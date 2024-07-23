import { useState } from 'react';
import { IonIcon } from '@ionic/react';

import { FixedModalContainer } from '.';
import CheckIcon from '../assets/svgs/check.svg';

import type { FixedModalProps } from '.';

const options = [
  '이미 멋진 친구를 많이 만났어요.',
  '피플히어 서비스에 만족하지 못했어요.',
  '기타 사유',
];

type Props = {
  onConfirm: () => void;
  setReason: (reason: string) => void;
};

const DeleteUser = (props: Props & FixedModalProps) => {
  const [clickedItem, setClickedItem] = useState('');

  return (
    <FixedModalContainer
      title="계정을 삭제하시나요?"
      buttonText="확인"
      onClickButton={() => {
        if (clickedItem) {
          props.setReason(clickedItem);
          props.onConfirm();
        }
      }}
      buttonDisabled={!clickedItem}
      {...props}
    >
      <div>
        <p className="mb-4 font-body2 text-gray6">삭제하려는 이유를 알려주세요.</p>

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
