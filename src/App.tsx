import { IonApp, setupIonicReact } from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import { useEffect, useLayoutEffect } from 'react';
import { Device } from '@capacitor/device';
import { Preferences } from '@capacitor/preferences';
import { useTranslation } from 'react-i18next';

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

import './i18n';
import { addFCMListeners, registerNotifications } from './services/fcmService';
import { sendNotification } from './api/notification';
import { initializeFirebase } from './services/firebase';

setupIonicReact();

const App = () => {
  const { i18n } = useTranslation();

  useLayoutEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    (async () => {
      const id = await Device.getId();
      const userLang = await Device.getLanguageCode();

      await Preferences.set({ key: 'DeviceId', value: id.identifier });
      await Preferences.set({ key: 'language', value: userLang.value });

      await i18n.changeLanguage(userLang.value);

      if (userLang.value === 'ko') {
        await Preferences.set({ key: 'autoTranslate', value: 'false' });
      } else {
        await Preferences.set({ key: 'autoTranslate', value: 'true' });
      }
    })();
  }, [i18n]);

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    (async () => {
      const platformInfo = await Device.getInfo();
      if (platformInfo.platform !== 'web') {
        await registerNotifications();
        await addFCMListeners();
        await sendNotification();
      }
    })();
  }, []);

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    initializeFirebase();
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
