import { languages } from '../constants/language';

export const findKoreanLanguageName = (englishName: string | string[]) => {
  if (Array.isArray(englishName)) {
    const koreanNames = englishName.map((el) => {
      const target = languages.find((lang) => lang.englishName.toUpperCase() === el)?.koreanName;

      return target ?? '';
    });

    return koreanNames.join(', ');
  }

  const target = languages.find(
    (lang) => lang.englishName.toUpperCase() === englishName,
  )?.koreanName;

  return target ?? '';
};

export const findLanguageCode = (englishName: string) => {
  const target = languages.find((lang) => lang.englishName.toUpperCase() === englishName)?.lang;

  return target ?? '';
};
