import { IonIcon, IonInput, IonText } from '@ionic/react';

import CloseIcon from '../../assets/svgs/close.svg';
import { memo, useState } from 'react';

const SelectRegion = () => {
  const [searchText, setSearchText] = useState('');

  return (
    <div className="relative p-4 pt-10">
      <IonIcon className="absolute svg-lg stroke-gray7 top-4 right-4" src={CloseIcon} />

      <IonText className="font-headline2 text-gray8">출신 국가를 선택하세요</IonText>

      <div className="h-11 bg-gray1.5 rounded-lg px-4 w-full justify-between items-center flex my-4">
        <IonInput
          className="font-body1 text-gray5"
          placeholder="국가 이름"
          value={searchText}
          onIonInput={(e) => setSearchText(e.target.value as string)}
        />
      </div>
    </div>
  );
};

export default memo(SelectRegion);
