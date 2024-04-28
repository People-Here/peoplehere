import {
  IonButtons,
  IonContent,
  IonIcon,
  IonImg,
  IonPage,
  IonText,
  IonTitle,
  IonToolbar,
  useIonRouter,
} from '@ionic/react';
import { useLocation } from 'react-router';
import { useEffect, useState } from 'react';

import useUserStore from '../../stores/user';
import ArrowLeftIcon from '../../assets/svgs/arrow-left.svg';
import EditIcon from '../../assets/svgs/edit.svg';
import LocationIcon from '../../assets/svgs/location.svg';
import CakeIcon from '../../assets/svgs/cake.svg';
import BagIcon from '../../assets/svgs/bag.svg';
import SchoolIcon from '../../assets/svgs/school.svg';
import ClockIcon from '../../assets/svgs/clock.svg';
import DogIcon from '../../assets/svgs/dog.svg';
import DoubleHeartIcon from '../../assets/svgs/double-heart.svg';
import LanguageIcon from '../../assets/svgs/language.svg';
import useSignInStore from '../../stores/signIn';

const Profile = () => {
  const router = useIonRouter();
  const location = useLocation();

  const user = useUserStore((state) => state.user);
  const region = useSignInStore((state) => state.region);

  const [isMe, setIsMe] = useState(false);

  useEffect(() => {
    const userId = location.pathname.split('/').at(-1);

    if (userId === user.id) {
      setIsMe(true);
    }
  }, [location.pathname, user.id]);

  return (
    <IonPage>
      <IonContent fullscreen>
        {/* header */}
        <IonToolbar className="px-4 h-14">
          <IonButtons slot="start">
            <IonIcon src={ArrowLeftIcon} className="svg-lg" onClick={() => router.goBack()} />
          </IonButtons>

          <IonTitle class="ion-text-center" className="font-headline3 text-gray8">
            Rachel
          </IonTitle>

          <IonButtons slot="end">
            <IonIcon
              src={isMe ? EditIcon : LanguageIcon}
              className="svg-lg"
              onClick={() => router.push('/profile/edit')}
            />
          </IonButtons>
        </IonToolbar>

        {/* image area */}
        <IonImg
          src="https://s3-alpha-sig.figma.com/img/afc3/d55f/e5c36a14de64294a4d95d39178303c7d?Expires=1714953600&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=j9CGsVO2L6EII5CnPTIwk6zZBbfmvQMTnKAFdrk0eg5dD415tsQa4PH5FxNjkD6H3ABhvoRgdkIyu07LdR9T8nHWN64UCqIhUyA8cUdpqWKV2P6RUhkDkk5ZhPiV4L3GgVANg-Pdp7Xb3CFll7lTriGdiB8jfOjLjQlLK8yKxjj3TI8ZP6j~nTy~4GRLNtsBzwAEGZM4NPoQeuI8Caf6aysRGT~fA2PBGqv0dqAxWwYFkf1tR3tU4vBPjGl1NT~LeeGUNyufmEK2sT-dsYmGLGsYnqMbmVvfjVTywZgoK257oSWXZOwO17XUbpeY1-rZWgaEpGWVb0JNDXdEYQq0Vg__"
          className="object-cover w-full h-[20.5rem]"
        />

        {/* content area */}
        <div className="px-4 mt-6 pb-28">
          <p className="mb-3 font-headline1 text-orange6">Rachel 님의 소개</p>
          <div className="p-4 mb-3 bg-gray1 rounded-xl">
            <IonText className="whitespace-pre-wrap font-body1 text-gray7">
              {
                '서울 26년 토박이 쩝쩝박사 🍕🧀🥖\n26년차 경력으로 맛집을 소개드려요.\n많이 걷고 맛있게 먹고 즐겁게 수다 떠는 것을 좋아해요. 신나고 맛있는 한국 여행을 원한다면 저와 함께 떠나요!'
              }
            </IonText>
          </div>

          <div className="flex gap-3 mb-3">
            <div className="flex flex-col flex-1 gap-1 p-4 mb-3 bg-gray1 rounded-xl">
              <p className="font-headline3 text-gray6">구사 언어</p>
              <p className="font-body1 text-gray7">한국어, 영어, 스페인어</p>
            </div>
            <div className="flex flex-col flex-1 gap-1 p-4 mb-3 bg-gray1 rounded-xl">
              <p className="font-headline3 text-gray6">출신 국가</p>
              <p className="font-body1 text-gray7">{region.koreanName}</p>
            </div>
          </div>

          <div className="flex flex-col gap-2 p-4 bg-white border border-gray2 rounded-xl">
            <IntroduceItem icon="location" title="거주지" value="대한민국 서울" />
            <IntroduceItem icon="age" title="나이" value="90년대생" />
            <IntroduceItem icon="job" title="직업" value="간호사" />
            <IntroduceItem icon="school" title="출신학교" value="한국대" />
            <IntroduceItem icon="hobby" title="취미" value="빵지순례" />
            <IntroduceItem icon="pet" title="반려동물" value="리트리버 빵떡" />
            <IntroduceItem icon="favorite" title="좋아하는 것" value="깨찰빵" />
          </div>
        </div>
      </IonContent>
    </IonPage>
  );
};

type IntroduceItemProps = {
  icon: string;
  title: string;
  value: string;
};
const IntroduceItem = ({ icon, title, value }: IntroduceItemProps) => {
  return (
    <div className="flex items-center">
      <IonIcon icon={iconMapper[icon]} className="svg-md mr-1.5" />

      <p className="font-body1 text-gray6">{title}</p>
      <Divider />
      <p className="font-body1 text-gray6">{value}</p>
    </div>
  );
};

const Divider = () => {
  return <div className="w-[2px] bg-gray4 h-[14px] mx-2 rounded-full" />;
};

const iconMapper: Record<string, string> = {
  location: LocationIcon,
  age: CakeIcon,
  job: BagIcon,
  school: SchoolIcon,
  hobby: ClockIcon,
  pet: DogIcon,
  favorite: DoubleHeartIcon,
};

export default Profile;
