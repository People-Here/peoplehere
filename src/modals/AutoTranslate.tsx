import { useLayoutEffect, useRef, useState } from 'react';
import { IonIcon, IonModal } from '@ionic/react';
import { Preferences } from '@capacitor/preferences';
import { useTranslation } from 'react-i18next';

import CloseIcon from '../assets/svgs/close.svg';

import type { ModalProps } from '.';

type Props = {
  onToggleChange?: (value: boolean) => void;
};

const AutoTranslate = ({ onToggleChange, ...rest }: Props & ModalProps) => {
  const { t } = useTranslation();

  // eslint-disable-next-line no-undef
  const modalRef = useRef<HTMLIonModalElement>(null);

  const [enableAutoTranslate, setEnableAutoTranslate] = useState(false);

  useLayoutEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    (async () => {
      const autoTranslate = await Preferences.get({ key: 'autoTranslate' });
      setEnableAutoTranslate(autoTranslate.value === 'true');
    })();
  }, []);

  return (
    <IonModal
      ref={modalRef}
      title={t('translation.auto')}
      breakpoints={[0.3, 0.4]}
      initialBreakpoint={0.3}
      {...rest}
    >
      <div className="relative px-4 py-6">
        <IonIcon
          className="absolute svg-lg stroke-gray7 top-4 right-4"
          icon={CloseIcon}
          onClick={() => modalRef.current?.dismiss()}
        />

        <p className="mb-5 text-center font-headline2 text-gray8">{t('translation.auto')}</p>

        <div>
          <div className="flex items-center justify-between mb-4">
            <p className="font-subheading2 text-gray7">{t('translation.auto')}</p>

            <Switch
              onOff={enableAutoTranslate}
              onChange={async () => {
                await Preferences.set({
                  key: 'autoTranslate',
                  value: String(!enableAutoTranslate),
                });
                setEnableAutoTranslate((prev) => !prev);
                onToggleChange?.(!enableAutoTranslate);
              }}
            />
          </div>

          <p className="font-body1 text-gray5">{t('translation.autoDetail')}</p>
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
