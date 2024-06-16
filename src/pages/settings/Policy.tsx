import { IonContent, IonPage } from '@ionic/react';
import { Link } from 'react-router-dom';

import Header from '../../components/Header';

const Policy = () => {
  return (
    <IonPage>
      <IonContent fullscreen>
        <Header type="back" title="법률" fixed />

        <div className="px-4">
          <Link
            to={{
              pathname: 'https://juiceisworking.notion.site/f19ce16564ef4f1980e5aa9c777c5572?pvs=4',
            }}
            target="_blank"
          >
            <div className="py-4 w-full border-b border-gray1.5">
              <p className="font-subheading2 text-gray7">개인정보 보호방침</p>
            </div>
          </Link>
          <Link to="/settings/policy/privacy">
            <div className="py-4 w-full border-b border-gray1.5">
              <p className="font-subheading2 text-gray7">서비스 약관</p>
            </div>
          </Link>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Policy;
