import { IonApp, setupIonicReact } from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import { useLayoutEffect } from 'react';
import { Device } from '@capacitor/device';
import { Preferences } from '@capacitor/preferences';

import NavigationBar from './components/NavigationBar';

/* Core CSS required for Ionic components to work properly */
import '@ionic/react/css/core.css';

/* Basic CSS for apps built with Ionic */
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';

/* Optional CSS utils that can be commented out */
import '@ionic/react/css/padding.css';
import '@ionic/react/css/float-elements.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/display.css';

/* Theme variables */
import './theme/variables.css';
import './theme/tailwind.css';
import './theme/global.css';

setupIonicReact();

const App = () => {
  useLayoutEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    (async () => {
      // const lang = await Preferences.get('language');
      // if (lang) return;

      // const response = await getAllLanguages();

      const id = await Device.getId();
      const userLang = await Device.getLanguageCode();

      if (userLang.value === 'ko') {
        userLang.value = 'ko-KR';
      }

      await Preferences.set({ key: 'DeviceId', value: id.identifier });
      await Preferences.set({ key: 'language', value: userLang.value });
    })();
  }, []);

  return (
    <IonApp>
      <IonReactRouter>
        <NavigationBar />
      </IonReactRouter>
    </IonApp>
  );
};

export default App;
