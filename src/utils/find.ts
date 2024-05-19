export const findKoreanLanguageName = (englishName: string) => {
  const target = langs.find((lang) => lang.englishName.toUpperCase() === englishName)?.koreanName;

  return target ?? '';
};

export const findLanguageCode = (englishName: string) => {
  const target = langs.find((lang) => lang.englishName.toUpperCase() === englishName)?.lang;

  return target ?? '';
};

const langs = [
  {
    koreanName: '한국어',
    englishName: 'Korean',
    lang: 'ko',
  },
  {
    koreanName: '영어',
    englishName: 'English',
    lang: 'en',
  },
  {
    koreanName: '일본어',
    englishName: 'Japanese',
    lang: 'ja',
  },
  {
    koreanName: '중국어',
    englishName: 'Chinese',
    lang: 'zh',
  },
  {
    koreanName: '스페인어',
    englishName: 'Spanish',
    lang: 'es',
  },
  {
    koreanName: '프랑스어',
    englishName: 'French',
    lang: 'fr',
  },
  {
    koreanName: '독일어',
    englishName: 'German',
    lang: 'de',
  },
  {
    koreanName: '러시아어',
    englishName: 'Russian',
    lang: 'ru',
  },
  {
    koreanName: '이탈리아어',
    englishName: 'Italian',
    lang: 'it',
  },
];
