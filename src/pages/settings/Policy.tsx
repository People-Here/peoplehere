import { IonContent, IonPage } from '@ionic/react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import Header from '../../components/Header';

const Policy = () => {
  const { t } = useTranslation();

  return (
    <IonPage>
      <IonContent fullscreen>
        <Header type="back" title={t('legal.title')} fixed />

        <div className="px-4 pt-14">
          <Link
            to={{
              pathname: 'https://juiceisworking.notion.site/f19ce16564ef4f1980e5aa9c777c5572?pvs=4',
            }}
            target="_blank"
          >
            <div className="py-4 w-full border-b border-gray1.5">
              <p className="font-subheading2 text-gray7">{t('legal.privacy')}</p>
            </div>
          </Link>
          <Link to="/settings/policy/privacy">
            <div className="py-4 w-full border-b border-gray1.5">
              <p className="font-subheading2 text-gray7">{t('legal.terms')}</p>
            </div>
          </Link>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Policy;
