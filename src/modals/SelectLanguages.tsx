import { useEffect, useState } from 'react';
import { IonCheckbox, IonList, IonText, isPlatform } from '@ionic/react';
import { useTranslation } from 'react-i18next';

import { languages as languageConstants } from '../constants/language';
import colors from '../theme/colors';
import { FixedModalContainer, type FixedModalProps } from '.';

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
    if (selected.some((lang) => lang.lang === language.lang)) {
      setSelected((prev) => prev.filter((lang) => lang.lang !== language.lang));
    } else {
      setSelected((prev) => [...prev, language]);
    }
  };

  useEffect(() => {
    setSelected(languages);
  }, [languages]);

  return (
    <FixedModalContainer
      title={t('editProfile.languages')}
      buttonText={t('progress.save')}
      onClickButton={() => setLanguages(selected)}
      {...props}
    >
      <section
        className={isMobile ? 'overflow-y-scroll h-[57vh] mb-4' : 'overflow-y-scroll h-[65vh] mb-4'}
      >
        <IonList lines="full">
          {languageConstants.map((language) => (
            <div key={language.lang} onClick={() => onClickLanguage(language)}>
              <div className="flex flex-col p-4 border-b border-gray1.5">
                <IonCheckbox
                  class="ion-no-margin"
                  justify="space-between"
                  checked={selected.some((lang) => lang.lang === language.lang)}
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
