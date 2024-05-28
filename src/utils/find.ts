import { languages } from '../constants/language';

export const findKoreanLanguageName = (englishName: string) => {
  const target = languages.find(
    (lang) => lang.englishName.toUpperCase() === englishName,
  )?.koreanName;

  return target ?? '';
};

export const findLanguageCode = (englishName: string) => {
  const target = languages.find((lang) => lang.englishName.toUpperCase() === englishName)?.lang;

  return target ?? '';
};
