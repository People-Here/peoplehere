/* eslint-disable @typescript-eslint/no-floating-promises */

import i18next from 'i18next';
import { initReactI18next } from 'react-i18next';

import translateKO from './locales/korean.json';
import translateEN from './locales/english.json';

i18next.use(initReactI18next).init({
  resources: { ko: translateKO, en: translateEN },
  fallbackLng: 'en',
  interpolation: {
    escapeValue: false,
  },
});

export default i18next;
