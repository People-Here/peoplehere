import { IonContent, IonPage } from '@ionic/react';
import { useEffect, useState } from 'react';
import { Preferences } from '@capacitor/preferences';

import Header from '../../components/Header';

const Translate = () => {
  const [isOn, setIsOn] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    (async () => {
      const { value } = await Preferences.get({ key: 'autoTranslate' });

      if (value === 'true') {
        setIsOn(true);
      }
    })();
  }, []);

  const onSwitch = async () => {
    await Preferences.set({ key: 'autoTranslate', value: isOn ? 'false' : 'true' });

    setIsOn((prev) => !prev);
  };

  return (
    <IonPage>
      <IonContent fullscreen>
        <Header type="back" title="번역" />

        <div className="px-4">
          <div className="flex gap-4 justify-between py-5 border-b border-gray1.5 w-full">
            <div>
              <p className="mb-1 text-black font-subheading2">자동 번역</p>
              <p className="font-caption2 text-gray5.5">
                외국어로 작성된 모든 내용을 한국어로 자동 번역합니다.
              </p>
            </div>

            <Switch onOff={isOn} onChange={onSwitch} />
          </div>
        </div>
      </IonContent>
    </IonPage>
  );
};

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

export default Translate;
