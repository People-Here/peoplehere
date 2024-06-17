import {
  IonActionSheet,
  IonButtons,
  IonIcon,
  IonImg,
  IonText,
  IonToolbar,
  useIonRouter,
} from '@ionic/react';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { Device } from '@capacitor/device';

import SettingIcon from '../../assets/svgs/setting.svg';
import ChevronRightIcon from '../../assets/svgs/chevron-right.svg';
import ThreeDotsIcon from '../../assets/svgs/three-dots.svg';
import MessageIcon from '../../assets/svgs/message-line-color.svg';
import MessageBlockedIcon from '../../assets/svgs/message-blocked.svg';
import PlusCircleOrangeIcon from '../../assets/svgs/plus-circle-orange.svg';
import useUserStore from '../../stores/user';
import { getUserProfile } from '../../api/profile';
import useSignInStore from '../../stores/signIn';
import DefaultUserImage from '../../assets/images/default-user.png';
import { getTourListByUser } from '../../api/tour';
import { getTranslateLanguage } from '../../utils/translate';

import type { DeviceInfo } from '@capacitor/device';
import type { Tour } from '../../api/tour';

const MyPage = () => {
  const { t } = useTranslation();
  const router = useIonRouter();

  const region = useSignInStore((state) => state.region);
  const { user, setUser } = useUserStore((state) => state);

  const [needProfileInfo, setNeedProfileInfo] = useState(false);
  const [tourList, setTourList] = useState<Tour[]>([]);

  const [platform, setPlatform] = useState<DeviceInfo['platform']>('web');

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    (async () => {
      const platformInfo = await Device.getInfo();
      setPlatform(platformInfo.platform);

      const lang = await getTranslateLanguage();

      const response = await getUserProfile(user.id, region.countryCode);
      const tourListResponse = await getTourListByUser(
        region.countryCode.toUpperCase(),
        lang,
        response.data.id.toString(),
      );

      if (
        !response.data.introduce ||
        !response.data.profileImageUrl ||
        !response.data.languages.length
      ) {
        setNeedProfileInfo(true);
      }

      if (response.status === 200) {
        setUser({
          id: response.data.id.toString(),
          email: response.data.email,
          firstName: response.data.firstName,
          lastName: response.data.lastName,
          profileImageUrl: response.data.profileImageUrl,
          phoneNumber: response.data.phoneNumber,
        });
      }

      if (tourListResponse.status === 200) {
        setTourList(tourListResponse.data.tourList);
      }
    })();
  }, [setUser, user.id, region.countryCode]);

  return (
    <>
      {/* header */}
      <IonToolbar
        slot="fixed"
        className={
          platform === 'web'
            ? 'px-4 bg-white h-14'
            : platform === 'android'
              ? 'px-4 bg-white h-14 flex items-end'
              : 'px-4 bg-white h-24 flex items-end'
        }
      >
        <p className="font-headline1 text-gray8">{t('mypage.title')}</p>

        <IonButtons slot="end">
          <IonIcon src={SettingIcon} className="svg-lg" onClick={() => router.push('/settings')} />
        </IonButtons>
      </IonToolbar>

      <div className="h-[100%] px-4 pb-20 mt-20">
        {needProfileInfo ? (
          <div className="flex flex-col justify-center items-center gap-12 h-[90%]">
            <div className="flex flex-col items-center gap-5">
              <IonImg src={DefaultUserImage} alt="default user" className="w-14 h-14" />

              <p
                className="text-center text-black whitespace-pre-wrap font-subheading1"
                style={{ lineHeight: '26px' }}
              >
                {'프로필을 완성하고\n사람들과 만나보세요'}
              </p>
            </div>

            <button
              className="px-6 text-white button-primary button-lg font-subheading1 w-fit"
              onClick={() => router.push(`/edit-profile/${user.id}`)}
            >
              프로필 완성하기
            </button>
          </div>
        ) : (
          <>
            <UserInfo image={user.profileImageUrl} name={user.firstName} />

            <div className="flex flex-col gap-4 mt-10">
              {tourList.length > 0 ? (
                <>
                  {tourList.map((tour) => (
                    <Link key={tour.id} to={`/tour/${tour.id.toString()}`}>
                      <TourInfo
                        id={tour.id.toString()}
                        image={
                          tour.placeInfo.imageUrlList.length > 0
                            ? tour.placeInfo.imageUrlList[0].imageUrl
                            : ''
                        }
                        title={tour.title}
                        placeName={tour.placeInfo.name}
                        district={tour.placeInfo.district}
                        available={true}
                      />
                    </Link>
                  ))}

                  <Link to="/post" className="flex items-center justify-center gap-1 p-3">
                    <IonIcon icon={PlusCircleOrangeIcon} className="svg-md" />
                    <p className="font-body1 text-orange6">장소 올리기</p>
                  </Link>
                </>
              ) : (
                <NoPlace />
              )}
            </div>
          </>
        )}
      </div>
    </>
  );
};

type UserInfoProps = {
  image: string;
  name: string;
};
const UserInfo = ({ image, name }: UserInfoProps) => {
  const { t } = useTranslation();
  const router = useIonRouter();

  const user = useUserStore((state) => state.user);

  return (
    <div
      className="flex items-center justify-between px-4"
      onClick={() => router.push(`/detail-profile/${user.id}`)}
    >
      <div className="flex items-center gap-4">
        <IonImg
          src={image ?? DefaultUserImage}
          alt="user profile image"
          className="object-cover overflow-hidden rounded-full w-14 h-14"
        />

        <div>
          <p className="font-headline3 text-gray7">{name}</p>
          <p className="font-body1 text-gray6">{t('mypage.seeProfile')}</p>
        </div>
      </div>

      <IonIcon src={ChevronRightIcon} className="w-[1.375rem] h-[1.375rem]" />
    </div>
  );
};

type TourInfoProps = {
  id: string;
  image: string;
  title: string;
  placeName: string;
  district: string;
  available?: boolean;
};
const TourInfo = ({ id, image, title, placeName, district, available }: TourInfoProps) => {
  const router = useIonRouter();

  const [isActionSheetOpen, setIsActionSheetOpen] = useState(false);

  return (
    <div className="relative flex gap-3 p-3 bg-white border rounded-xl border-gray2">
      <IonIcon
        icon={ThreeDotsIcon}
        className="absolute top-3 right-3 svg-md"
        onClick={(e) => {
          e.preventDefault();
          setIsActionSheetOpen(true);
        }}
      />

      <IonImg
        src={image}
        className="w-[4.5rem] h-[4.5rem] shrink-0 object-cover rounded-xl overflow-hidden"
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
            {placeName}
            {district && <span className="font-body2 text-gray6"> | {district}</span>}
          </p>
        </div>
      </div>

      <IonActionSheet
        isOpen={isActionSheetOpen}
        onDidDismiss={() => setIsActionSheetOpen(false)}
        buttons={[
          {
            text: '수정하기',
            handler: () => {
              router.push(`/post/${id}`);
            },
          },
          {
            text: '상태 변경하기',
            handler: () => {
              router.push(`/change-status/${id}`);
            },
          },
          {
            text: '취소',
            role: 'cancel',
            data: {
              action: 'cancel',
            },
          },
        ]}
      />
    </div>
  );
};

const NoPlace = () => {
  const { t } = useTranslation();

  return (
    <Link to="/post" className="flex flex-col items-center gap-6 mt-20">
      <p className="text-center whitespace-pre-wrap font-body1 text-gray5">{t('mypage.noPlace')}</p>
      <button className="flex items-center gap-2 px-3 button-sub button-lg w-fit h-11">
        <IonIcon icon={PlusCircleOrangeIcon} className="svg-md" />
        <p className="font-body1 text-orange5">{t('newTour.post')}</p>
      </button>
    </Link>
  );
};

export default MyPage;
