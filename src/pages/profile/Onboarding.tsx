import { IonContent, IonImg, IonPage, IonText } from '@ionic/react';

import Header from '../../components/Header';
import OnboardingImage from '../../assets/images/profile-onboarding.png';
import Footer from '../../layouts/Footer';

const Onboarding = () => {
  return (
    <IonPage>
      <IonContent fullscreen>
        <Header type="close" />

        <div className="flex flex-col items-center px-4">
          <IonImg src={OnboardingImage} className="mt-20 mb-8" />

          <IonText className="text-center whitespace-pre-wrap font-headline1 text-gray8">
            {'프로필을 생성하고\n나만의 데이트립을 만들어 보세요'}
          </IonText>
        </div>

        <Footer>
          <button className="w-full button-primary button-lg">프로필 생성하기</button>
        </Footer>
      </IonContent>
    </IonPage>
  );
};

export default Onboarding;
