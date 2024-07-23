import { useState } from 'react';
import { IonCheckbox, IonList, IonText, isPlatform } from '@ionic/react';
import { useTranslation } from 'react-i18next';

import { languages as languageConstants } from '../constants/language';
import { FixedModalContainer } from '.';
import colors from '../theme/colors';

import type { FixedModalProps } from '.';

export type Language = {
  koreanName: string;
  englishName: string;
  lang: string;
};

type Props = {
  languages: Language[];
  setLanguages: (languages: Language[]) => void;
};

const SelectLanguages = ({ languages, setLanguages, ...props }: FixedModalProps & Props) => {
  const { t, i18n } = useTranslation();

  const isMobile = isPlatform('iphone') || isPlatform('android');

  const [selected, setSelected] = useState<Language[]>([]);

  const onClickLanguage = (language: Language) => {
    if (selected.includes(language)) {
      setSelected(selected.filter((lang) => lang.lang !== language.lang));
    } else {
      setSelected([...selected, language]);
    }
  };

  return (
    <FixedModalContainer
      title="구사 언어를 모두 선택하세요"
      buttonText={t('common.select')}
      onDismiss={() => setLanguages(selected)}
      onPresent={() => setSelected(languages)}
      {...props}
    >
      <section
        className={isMobile ? 'overflow-y-scroll h-[57vh] mb-4' : 'overflow-y-scroll h-[65vh] mb-4'}
      >
        <IonList lines="full">
          {languageConstants.map((language) => (
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
    </FixedModalContainer>
  );
};

export default SelectLanguages;
