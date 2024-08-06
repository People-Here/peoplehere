import { IonIcon, IonLabel, IonRouterOutlet, IonTabBar, IonTabButton, IonTabs } from '@ionic/react';
import { useEffect, useState } from 'react';
import { useLocation } from 'react-router';
import { useTranslation } from 'react-i18next';

import HomeIcon from '../assets/svgs/home.svg';
import HomeLineIcon from '../assets/svgs/home-line.svg';
import HeartIcon from '../assets/svgs/double-heart.svg';
import HeartLineIcon from '../assets/svgs/heart-line.svg';
import PlusLineIcon from '../assets/svgs/plus-circle-line.svg';
import MessageIcon from '../assets/svgs/message.svg';
import MessageLineIcon from '../assets/svgs/message-line.svg';
import ProfileIcon from '../assets/svgs/user.svg';
import ProfileLineIcon from '../assets/svgs/user-line.svg';
import Router from '../Router';

const whiteList = ['home', 'bookmark', 'message', 'profile'];

const NavigationBar = () => {
  const { t } = useTranslation();

  const [currentTab, setCurrentTab] = useState('home');
  const location = useLocation();

  useEffect(() => {
    setCurrentTab(location.pathname.split('/')[1]);
  }, [location.pathname]);

  return (
    <IonTabs>
      <IonRouterOutlet>
        <Router />
      </IonRouterOutlet>

      <IonTabBar
        slot="bottom"
        defaultValue="home"
        onIonTabsDidChange={(event) => setCurrentTab(event.detail.tab)}
        hidden={
          location.pathname.split('/').length <= 2 &&
          whiteList.includes(location.pathname.split('/')[1])
            ? false
            : true
        }
      >
        <IonTabButton tab="home" href="/home">
          <IonIcon
            aria-hidden="true"
            className="svg-lg"
            src={currentTab === 'home' ? HomeIcon : HomeLineIcon}
          />
          <IonLabel
            className={`font-caption3 ${currentTab === 'home' ? 'text-orange5' : 'text-gray6'}`}
          >
            {t('nav.home')}
          </IonLabel>
        </IonTabButton>
        <IonTabButton tab="bookmark" href="/bookmark">
          <IonIcon
            aria-hidden="true"
            className="svg-lg"
            src={currentTab === 'bookmark' ? HeartIcon : HeartLineIcon}
          />
          <IonLabel
            className={`font-caption3 ${currentTab === 'bookmark' ? 'text-orange5' : 'text-gray6'}`}
          >
            {t('nav.bookmark')}
          </IonLabel>
        </IonTabButton>
        <IonTabButton tab="post" href="/post">
          <IonIcon aria-hidden="true" className="pt-1 pb-3 w-9 h-9" src={PlusLineIcon} />
        </IonTabButton>
        <IonTabButton tab="message" href="/message">
          <IonIcon
            aria-hidden="true"
            className="svg-lg"
            src={currentTab === 'message' ? MessageIcon : MessageLineIcon}
          />
          <IonLabel
            className={`font-caption3 ${currentTab === 'message' ? 'text-orange5' : 'text-gray6'}`}
          >
            {t('nav.inbox')}
          </IonLabel>
        </IonTabButton>
        <IonTabButton tab="profile" href="/profile">
          <IonIcon
            aria-hidden="true"
            className="svg-lg"
            src={currentTab === 'profile' ? ProfileIcon : ProfileLineIcon}
          />
          <IonLabel
            className={`font-caption3 ${currentTab === 'profile' ? 'text-orange5' : 'text-gray6'}`}
          >
            {t('nav.mypage')}
          </IonLabel>
        </IonTabButton>
      </IonTabBar>
    </IonTabs>
  );
};

export default NavigationBar;
