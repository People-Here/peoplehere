import { Preferences } from '@capacitor/preferences';

export const getTranslateLanguage = async () => {
  const auto = await Preferences.get({ key: 'autoTranslate' });
  const language = await Preferences.get({ key: 'language' });

  if (auto.value === 'false') {
    return 'ORIGIN';
  }

  return language.value === 'ko' ? 'KOREAN' : 'ENGLISH';
};
