import { IonContent, IonIcon, IonPage, IonText, IonToolbar } from '@ionic/react';
import { useLayoutEffect, useState } from 'react';

import MessageIcon from '../assets/svgs/message-line-color.svg';
import MessageBlockedIcon from '../assets/svgs/message-blocked.svg';
import HeartFilledIcon from '../assets/svgs/heart-filled.svg';
import useLogin from '../hooks/useLogin';
import { getBookmarkList } from '../api/tour';
import useSignInStore from '../stores/signIn';
import { getNewToken } from '../api/login';

import type { BookmarkedTour } from '../api/tour';
import type { AxiosError } from 'axios';

const BookmarkTab = () => {
  const { checkLogin } = useLogin();

  const region = useSignInStore((state) => state.region);

  const [list, setList] = useState<BookmarkedTour[]>([]);

  useLayoutEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    (async () => {
      const isLoggedIn = await checkLogin();
      if (!isLoggedIn) {
        return;
      }

      try {
        const response = await getBookmarkList(region.countryCode.toUpperCase(), 'KOREAN');
        setList(response.data.tourList);
      } catch (error) {
        const errorInstance = error as AxiosError;

        if (errorInstance.response?.status === 401) {
          await getNewToken();

          const response = await getBookmarkList(region.countryCode.toUpperCase(), 'KOREAN');
          setList(response.data.tourList);
        }

        console.error('fail to get bookmark list', error);
      }
    })();
  }, []);

  return (
    <IonPage>
      <IonContent fullscreen>
        {/* header */}
        <IonToolbar className="px-4 bg-white h-14">
          <p className="pl-0 font-headline1 text-gray8">관심 목록</p>
        </IonToolbar>

        {/* body */}
        {list.length === 0 ? (
          <div className="flex items-center justify-center h-full -mt-14">
            <p className="font-headline2 text-gray6">관심 목록이 비어있어요.</p>
          </div>
        ) : (
          <div className="flex flex-col gap-3 px-4 mt-[1.625rem]">
            {list.map((item) => (
              <ListItem
                key={item.id}
                title={item.title}
                placeName={item.placeInfo.name}
                district={item.placeInfo.district}
                images={item.placeInfo.imageUrlList}
                available={item.userInfo.directMessageStatus}
                user={{
                  id: item.userInfo.id.toString(),
                  name: item.userInfo.firstName,
                  imageUrl: item.userInfo.profileImageUrl,
                }}
              />
            ))}
          </div>
        )}
      </IonContent>
    </IonPage>
  );
};

type ListItemProps = {
  title: string;
  placeName: string;
  district: string;
  images: string[];
  available: boolean;
  user: {
    id: string;
    name: string;
    imageUrl: string;
  };
};
const ListItem = ({ title, placeName, district, images, available, user }: ListItemProps) => {
  return (
    <div className="flex flex-col gap-3 p-3 border border-gray2 rounded-2xl">
      <div className="-mr-4">
        {/* title area */}
        <div className="flex flex-col gap-1.5 mb-3 pr-4">
          <StatusChip available />

          <div className="pl-1 flex flex-col gap-0.5">
            <div className="flex items-center justify-between">
              <IonText className="font-headline3 text-gray8">{title}</IonText>
              <IonIcon icon={HeartFilledIcon} className="svg-lg" />
            </div>

            <div className="flex items-center">
              <IonText className="font-caption1 text-gray6">{placeName}</IonText>
              <Divider />
              <IonText className="font-caption2 text-gray6">{district}</IonText>
            </div>
          </div>
        </div>

        {/* content area */}
      </div>
    </div>
  );
};

const StatusChip = ({ available }: { available?: boolean }) => {
  return available ? (
    <div className="flex items-center gap-[5px] px-2 py-1 bg-orange1 rounded-[10px] w-fit">
      <IonText className="font-caption1 text-orange5">말 걸 수 있음</IonText>
      <IonIcon icon={MessageIcon} className="svg-sm" />
    </div>
  ) : (
    <div className="flex items-center gap-[5px] px-2 py-1 bg-gray1.5 rounded-[10px] w-fit">
      <IonText className="font-caption1 text-gray6">쪽지 마감</IonText>
      <IonIcon icon={MessageBlockedIcon} className="svg-sm" />
    </div>
  );
};

const Divider = () => {
  return <div className="w-[1px] bg-gray6 h-3 mx-1.5" />;
};

export default BookmarkTab;
