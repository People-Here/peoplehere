import { FirebaseAnalytics } from '@capacitor-community/firebase-analytics';

export const initializeFirebase = async () => {
  await FirebaseAnalytics.initializeFirebase({
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY as string,
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN as string,
    projectId: 'peoplehere-645a3',
    storageBucket: 'peoplehere-645a3.appspot.com',
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID as string,
    appId: import.meta.env.VITE_FIREBASE_APP_ID as string,
    measurementId: 'G-FLE98C3F7X',
  });
};
