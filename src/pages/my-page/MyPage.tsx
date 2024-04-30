import { IonButtons, IonIcon, IonImg, IonText, IonToolbar } from '@ionic/react';

import SettingIcon from '../../assets/svgs/setting.svg';
import ChevronRightIcon from '../../assets/svgs/chevron-right.svg';
import ThreeDotsIcon from '../../assets/svgs/three-dots.svg';
import MessageIcon from '../../assets/svgs/message-line-color.svg';
import MessageBlockedIcon from '../../assets/svgs/message-blocked.svg';
import PlusCircleOrangeIcon from '../../assets/svgs/plus-circle-orange.svg';

const MyPage = () => {
  return (
    <>
      {/* header */}
      <IonToolbar className="px-4 h-14">
        <p className="font-headline3 text-gray8">마이페이지</p>

        <IonButtons slot="end">
          <IonIcon src={SettingIcon} className="svg-lg" />
        </IonButtons>
      </IonToolbar>

      <div className="px-4 mt-6">
        <UserInfo image="https://picsum.photos/seed/picsum/200/300" name="레이첼" />

        <div className="flex flex-col gap-4 mt-10">
          <TourInfo
            image="https://picsum.photos/seed/picsum/200/300"
            title="홍대에서 만나는 디자인과 예술"
            placeName="건국대학교"
            district="광진구"
            available
          />
          <TourInfo
            image="https://picsum.photos/seed/picsum/200/300"
            title="홍대에서 만나는 디자인과 예술"
            placeName="건국대학교"
            district="광진구"
          />

          <div className="flex items-center justify-center gap-1 p-3">
            <IonIcon icon={PlusCircleOrangeIcon} className="svg-md" />
            <p className="font-body1 text-orange6">장소 올리기</p>
          </div>
        </div>
      </div>
    </>
  );
};

type UserInfoProps = {
  image: string;
  name: string;
};
const UserInfo = ({ image, name }: UserInfoProps) => {
  return (
    <div className="flex items-center justify-between px-4">
      <div className="flex items-center gap-4">
        <IonImg src={image} className="object-cover overflow-hidden rounded-full w-14 h-14" />

        <div>
          <p className="font-headline3 text-gray7">{name}</p>
          <p className="font-body1 text-gray6">프로필 완성하기</p>
        </div>
      </div>

      <IonIcon src={ChevronRightIcon} className="w-[1.375rem] h-[1.375rem]" />
    </div>
  );
};

type TourInfoProps = {
  image: string;
  title: string;
  placeName: string;
  district: string;
  available?: boolean;
};
const TourInfo = ({ image, title, placeName, district, available }: TourInfoProps) => {
  return (
    <div className="relative flex gap-3 p-3 bg-white border rounded-xl border-gray2">
      <IonIcon icon={ThreeDotsIcon} className="absolute top-3 right-3 svg-md" />

      <IonImg
        src={image}
        className="w-[4.5rem] h-[4.5rem] object-cover rounded-xl overflow-hidden"
      />

      <div>
        {available ? (
          <div className="flex items-center gap-1 px-1.5 py-[0.1875rem] bg-orange1 rounded-lg w-fit">
            <IonText className="font-semibold text-[0.625rem] -tracking-[0.2px] leading-4 text-orange5">
              쪽지 받기
            </IonText>
            <IonIcon icon={MessageIcon} className="svg-xs" />
          </div>
        ) : (
          <div className="flex items-center gap-1 px-1.5 py-[0.1875rem] bg-gray1.5 rounded-lg w-fit">
            <IonText className="font-semibold text-[0.625rem] -tracking-[0.2px] leading-4 text-gray6">
              쪽지 마감
            </IonText>
            <IonIcon icon={MessageBlockedIcon} className="svg-xs" />
          </div>
        )}

        <div className="mt-1">
          <p className="font-headline3 text-gray8">{title}</p>
          <p className="font-body1 text-gray6">
            {placeName} | {district}
          </p>
        </div>
      </div>
    </div>
  );
};

export default MyPage;
