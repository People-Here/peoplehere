import { useRef, useState } from 'react';
import { IonIcon, IonModal } from '@ionic/react';
import { Preferences } from '@capacitor/preferences';

import CloseIcon from '../assets/svgs/close.svg';

import type { ModalProps } from '.';

const AutoTranslate = (props: ModalProps) => {
  // eslint-disable-next-line no-undef
  const modalRef = useRef<HTMLIonModalElement>(null);

  const [enableAutoTranslate, setEnableAutoTranslate] = useState(false);

  return (
    <IonModal
      ref={modalRef}
      title="번역"
      breakpoints={[0.2, 0.3, 0.4]}
      initialBreakpoint={0.2}
      {...props}
    >
      <div className="relative px-4 py-6">
        <IonIcon
          className="absolute svg-lg stroke-gray7 top-4 right-4"
          icon={CloseIcon}
          onClick={() => modalRef.current?.dismiss()}
        />

        <p className="mb-5 text-center font-headline2 text-gray8">번역</p>

        <div className="flex items-center justify-between">
          <div>
            <p className="font-subheading2 text-gray7">자동 번역 활성화</p>
            <p className="font-body1 text-gray5">외국어를 한국어로 자동 번역합니다.</p>
          </div>

          <Switch
            onOff={enableAutoTranslate}
            onChange={async () => {
              await Preferences.set({ key: 'autoTranslate', value: String(!enableAutoTranslate) });
              setEnableAutoTranslate((prev) => !prev);
            }}
          />
        </div>
      </div>
    </IonModal>
  );
};

export default AutoTranslate;

const Switch = ({ onOff, onChange }: { onOff: boolean; onChange: () => void }) => {
  return (
    <div
      className={
        onOff
          ? 'relative w-12 px-0.5 rounded-full h-7 shrink-0 bg-orange5 transition-all duration-300'
          : 'relative w-12 px-0.5 rounded-full h-7 shrink-0 bg-gray5 transition-all duration-300'
      }
      onClick={onChange}
    >
      <span
        className="absolute w-6 transition-all duration-300 ease-in-out bg-white rounded-full aspect-square top-1/2"
        style={onOff ? { transform: 'translate(20px, -50%)' } : { transform: 'translateY(-50%)' }}
      />
      {/* <span className="absolute w-6 transition-all duration-300 ease-in-out translate-x-full -translate-y-1/2 bg-white rounded-full aspect-square top-1/2" /> */}
    </div>
  );
};
