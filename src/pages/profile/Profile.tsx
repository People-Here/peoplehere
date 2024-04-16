import { IonContent, IonIcon, IonLabel, IonPage, IonText } from '@ionic/react';

import Header from '../../components/Header';
import PlusCircleOrange from '../../assets/svgs/plus-circle-orange.svg';
import GlobeIcon from '../../assets/svgs/globe.svg';
import LanguageIcon from '../../assets/svgs/language.svg';
import DoubleHeartIcon from '../../assets/svgs/double-heart.svg';
import ClockIcon from '../../assets/svgs/clock.svg';
import DogIcon from '../../assets/svgs/dog.svg';
import CakeIcon from '../../assets/svgs/cake.svg';
import Footer from '../../layouts/Footer';

const listItems = [
  { iconSrc: GlobeIcon, title: '출신국가', value: '대한민국', required: true },
  { iconSrc: LanguageIcon, title: '구사언어', required: true },
  { iconSrc: DoubleHeartIcon, title: '좋아하는 것', required: false },
  { iconSrc: ClockIcon, title: '취미', required: false },
  { iconSrc: DogIcon, title: '반려동물', required: false },
  { iconSrc: CakeIcon, title: '나이', required: false },
];

const Profile = () => {
  return (
    <IonPage>
      <IonContent fullscreen>
        <Header type="close" title="Rachel" />

        {/* title area */}
        <div className="px-4 mt-2 mb-4">
          <div className="border border-gray3 rounded-2xl flex items-center py-2 flex-col gap-1.5">
            <IonText className="text-center whitespace-pre-wrap font-body1 text-gray6">
              {'피플히어의 다른 회원들에게\n나를 소개하는 프로필을 만들어 주세요.'}
            </IonText>
            <IonText className="font-caption1 text-gray5">
              한글로 작성할 경우 자동으로 영문 번역될 수 있어요.
            </IonText>
          </div>
        </div>

        {/* image area */}
        <ImageArea />

        {/* content area */}
        <div className="px-4 pb-28 mt-7">
          <div className="flex items-center justify-between mb-4">
            <IonText className="font-headline2 text-gray7">자기 소개</IonText>
            <RequiredChip />
          </div>

          <div className="p-4 bg-gray1.5 rounded-xl mb-4">
            <IonText className="font-body1 text-gray8">
              {
                '서울 26년 토박이 쩝쩝박사 🍕🧀🥖\n26년차 경력으로 맛집을 소개드려요.\n많이 걷고 맛있게 먹고 즐겁게 수다 떠는 것을 좋아해요. 신나고 맛있는 한국 여행을 원한다면 저와 함께 떠나요!'
              }
            </IonText>
          </div>

          <div role="list">
            {listItems.map((item) => (
              <ListItem
                key={item.title}
                iconSrc={item.iconSrc}
                title={item.title}
                value={item.value}
                required={item.required}
              />
            ))}
          </div>
        </div>

        <Footer>
          <button className="w-full button-primary button-lg">완료</button>
        </Footer>
      </IonContent>
    </IonPage>
  );
};

const RequiredChip = () => {
  return (
    <span className="px-2 py-0.5 border border-orange2 bg-orange1 rounded-full font-caption1 text-orange5">
      필수
    </span>
  );
};

const ImageArea = () => {
  return (
    <div className="bg-gray1 w-full h-[20.5rem] flex items-center justify-center relative">
      <div className="absolute top-4 right-4">
        <RequiredChip />
      </div>

      <div className="flex flex-col items-center gap-3">
        <IonIcon icon={PlusCircleOrange} className="w-9 h-9" />
        <IonText className="font-subheading2 text-gray5.5">프로필 사진을 추가하세요</IonText>
      </div>
    </div>
  );
};

type ListItemProps = {
  iconSrc: string;
  title: string;
  value?: string;
  required?: boolean;
};
const ListItem = ({ iconSrc, title, value, required }: ListItemProps) => {
  return (
    <div className="flex items-center justify-between py-4 border-b border-gray1.5">
      <div className="flex items-center gap-4">
        <IonIcon icon={iconSrc} className="svg-lg" />
        <IonLabel className="font-body1 text-gray8">
          {title}
          {value && `: ${value}`}
        </IonLabel>
      </div>

      {required && <RequiredChip />}
    </div>
  );
};

export default Profile;
