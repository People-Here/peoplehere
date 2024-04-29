import {
  IonButtons,
  IonContent,
  IonIcon,
  IonImg,
  IonPage,
  IonText,
  IonToolbar,
  useIonRouter,
} from '@ionic/react';

import ArrowLeftIcon from '../../assets/svgs/arrow-left.svg';
import LanguagueIcon from '../../assets/svgs/language.svg';
import ShareIcon from '../../assets/svgs/share.svg';
import ChevronRightIcon from '../../assets/svgs/chevron-right.svg';

const Preview = () => {
  const router = useIonRouter();

  return (
    <IonPage>
      <IonContent fullscreen>
        {/* header */}
        <IonToolbar className="px-4 bg-white h-14">
          <IonButtons slot="start">
            <IonIcon src={ArrowLeftIcon} className="svg-lg" onClick={() => router.goBack()} />
          </IonButtons>

          <IonButtons slot="end" className="flex items-center gap-3">
            <IonIcon src={LanguagueIcon} className="svg-lg" />
            <IonIcon src={ShareIcon} className="svg-lg" />
          </IonButtons>
        </IonToolbar>

        <div className="flex justify-center w-full mt-6 mb-12">
          <UserImage src="https://picsum.photos/seed/picsum/200/300" name="Rachel" />
        </div>

        <div className="relative bg-gray8">
          <div className="absolute rounded-full w-[37.5rem] h-[37.5rem] bg-gray8 -top-28 -left-[7.1875rem] -z-10" />

          <div className="flex flex-col items-center gap-6 mb-16 px-9">
            <div className="flex items-center bg-gray7 rounded py-0.5 px-1.5 w-fit">
              <p className="font-body1 text-gray2">구사언어</p>
              <Divider />
              <p className="font-body1 text-gray2">한국어, 영어, 스페인어</p>
            </div>

            <p className="leading-6 text-center text-white font-body1">
              {
                '새로운 사람을 만나고 다양한 문화에 대해 알아가는 것을 좋아해요! 감성적인 장소, 맛있는 음식, 도란도란한 산책을 좋아하는 분들과 즐거운 시간을 보내고 싶어요. ☺️'
              }
            </p>
          </div>

          <div className="px-4 pb-20">
            <p className="mb-4 text-center font-headline1 text-gray1">송리단길과 석촌호수 산책</p>

            <div className="w-full h-[16.25rem] rounded-[20px] border-[0.5px] border-gray5.5 overflow-hidden mb-5">
              <IonImg
                src="https://picsum.photos/seed/picsum/200/300"
                alt="place image"
                className="object-cover w-full h-full"
              />
            </div>

            <PlaceInfo
              image="https://picsum.photos/seed/picsum/200/300"
              title="로니로티 건대점"
              address="서울 광진구 아차산로 225 단산화빌딩"
            />

            <div className="p-4 flex flex-col gap-2.5 bg-gray7 rounded-xl mt-2">
              <p className="font-headline3 text-gray1">우리 여기서 같이 뭐할까?</p>
              <p className="font-body2 text-gray2">
                {
                  '근처 송리단길에서 밥 먹고 석촌호수 공원 한 바퀴 돌아요! 그러다 좀 심심하면 월드타워 가서 같이 아이쇼핑해도 재밌을 것 같아요 ㅎㅎ'
                }
              </p>
            </div>
          </div>
        </div>
      </IonContent>
    </IonPage>
  );
};

type ImageProps = {
  src: string;
  name: string;
};
const UserImage = ({ src, name }: ImageProps) => {
  return (
    <div className="overflow-hidden rounded-xl w-[100px] h-full relative flex justify-center shrink-0 border-[0.5px] border-gray5.5">
      <IonImg className="w-[100px] h-full object-cover" src={src} alt="user profile" />

      <div
        className="h-[72px] absolute bottom-0 left-0 right-0"
        style={{
          background: 'linear-gradient(180deg, rgba(27, 29, 31, 0.00) 0%, #1B1D1F 100%)',
        }}
      ></div>
      <IonText className="absolute overflow-hidden font-body1 bottom-3 text-gray2 text-ellipsis">
        {name}
      </IonText>
    </div>
  );
};

const Divider = () => {
  return <div className="w-[2px] bg-gray3 h-[14px] mx-2 rounded-full" />;
};

type PlaceInfoProps = {
  image: string;
  title: string;
  address: string;
};
const PlaceInfo = ({ image, title, address }: PlaceInfoProps) => {
  return (
    <div className="flex items-center justify-between p-4 bg-gray7 rounded-xl">
      <div className="flex items-center gap-3">
        <IonImg
          src={image}
          alt={`place-${title}`}
          className="object-cover overflow-hidden rounded-lg w-11 h-11"
        />

        <div className="flex flex-col gap-0.5">
          <p className="text-white font-subheading2">{title}</p>
          <p className="font-caption2 text-gray5">{address}</p>
        </div>
      </div>

      <IonIcon icon={ChevronRightIcon} className="w-[1.375rem] h-[1.375rem]" />
    </div>
  );
};

export default Preview;
