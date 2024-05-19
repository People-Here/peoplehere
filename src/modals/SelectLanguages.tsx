import { useState } from 'react';
import { IonCheckbox, IonList, IonText, isPlatform } from '@ionic/react';
import { useTranslation } from 'react-i18next';

import ModalContainer from '.';
import colors from '../theme/colors';

import type { ModalProps } from '.';

export type Language = {
  koreanName: string;
  englishName: string;
  lang: string;
};

type Props = {
  languages: Language[];
  setLanguages: (languages: Language[]) => void;
};

const SelectLanguages = ({ languages, setLanguages, ...props }: ModalProps & Props) => {
  const { t, i18n } = useTranslation();

  const isMobile = isPlatform('iphone') || isPlatform('android');

  const [selected, setSelected] = useState<Language[]>([]);

  console.log('here', selected);

  const onClickLanguage = (language: Language) => {
    if (selected.includes(language)) {
      setSelected(selected.filter((lang) => lang.lang !== language.lang));
    } else {
      setSelected([...selected, language]);
    }
  };

  return (
    <ModalContainer
      title="구사 언어를 모두 선택하세요"
      buttonText={t('common.select')}
      initialBreakpoint={0.87}
      breakpoints={[0, 0.87, 0.95]}
      onWillDismiss={() => setLanguages(selected)}
      onWillPresent={() => setSelected(languages)}
      {...props}
    >
      <section
        className={isMobile ? 'overflow-y-scroll h-[57vh] mb-4' : 'overflow-y-scroll h-[65vh] mb-4'}
      >
        <IonList lines="full">
          {data.langs.map((language) => (
            <div key={language.lang}>
              <div className="flex flex-col p-4 border-b border-gray1.5">
                <IonCheckbox
                  class="ion-no-margin"
                  justify="space-between"
                  checked={selected.map((lang) => lang.lang).includes(language.lang)}
                  onIonChange={() => onClickLanguage(language)}
                  style={{
                    '--size': '18px',
                    '--checkbox-background': colors.gray3,
                    '--checkbox-background-checked': colors.orange5,
                    '--border-width': 0,
                  }}
                >
                  <IonText className="font-body1 text-gray5.5">
                    {i18n.resolvedLanguage === 'ko' ? language.koreanName : language.englishName}
                  </IonText>
                </IonCheckbox>
              </div>
            </div>
          ))}
        </IonList>
      </section>
    </ModalContainer>
  );
};

export default SelectLanguages;

const data = {
  langs: [
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
  ],
};
