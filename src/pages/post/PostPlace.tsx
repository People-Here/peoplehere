import {
  IonActionSheet,
  IonFooter,
  IonIcon,
  IonImg,
  IonText,
  IonToolbar,
  useIonRouter,
} from '@ionic/react';
import { useEffect, useState } from 'react';
import { Camera } from '@capacitor/camera';
import { Preferences } from '@capacitor/preferences';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router';

import Header from '../../components/Header';
import PlusCircleWhiteIcon from '../../assets/svgs/plus-circle-white.svg';
import CameraIcon from '../../assets/svgs/camera.svg';
import RightChevron from '../../assets/svgs/right-chevron.svg';
import GridDeleteIcon from '../../assets/svgs/grid-delete.svg';
import useUserStore from '../../stores/user';
import usePostPlaceStore from '../../stores/place';
import { getTourDetail } from '../../api/tour';
import useSignInStore from '../../stores/signIn';
import SearchPlace from '../../modals/SearchPlace';
import Alert from '../../components/Alert';
import { getDefaultImages } from '../../api/place';
import Toast from '../../toasts/Toast';

import type { PlaceItem as PlaceItemType } from '../../modals/SearchPlace';

const Post = () => {
  const { t } = useTranslation();

  const router = useIonRouter();
  const location = useLocation();

  const tourId = location.pathname.split('/').at(-1) ?? '';

  const user = useUserStore((state) => state.user);
  const region = useSignInStore((state) => state.region);
  const {
    place: storedPlace,
    setPlace: storePlace,
    title: storedTitle,
    setTitle: storeTitle,
    description: storedDescription,
    setDescription: storeDescription,
    images: storedImages,
    setImages: storeImages,
    setFetchImages,
    setTheme,
    setIsDefaultImage,
    clearAll,
  } = usePostPlaceStore((state) => state);

  const [place, setPlace] = useState<PlaceItemType>(
    storedPlace ?? { id: '', text: '', description: '', latitude: 0, longitude: 0 },
  );

  const [title, setTitle] = useState(storedTitle ?? '');
  const [description, setDescription] = useState(storedDescription ?? '');
  const [images, setImages] = useState<
    { imageUrl: string; authorName?: string; authorUrl?: string }[]
  >(storedImages ?? null);

  const [showPhotoOptionSheet, setShowPhotoOptionSheet] = useState(false);
  const [showExitAlert, setShowExitAlert] = useState(false);
  const [showDefaultImageAlert, setShowDefaultImageAlert] = useState(false);
  const [showToast, setShowToast] = useState(false);

  const selectPhotosFromGallery = async () => {
    const selectedImages = await Camera.pickImages({
      limit: 12 - images.length,
    });

    setImages(
      selectedImages.photos.map((photo) => {
        return {
          imageUrl: photo.webPath,
        };
      }),
    );
    setFetchImages(true);
    setIsDefaultImage(false);
  };

  const getGoogleDefaultImages = async () => {
    if (!place.id) {
      setShowToast(true);
      return;
    }

    try {
      const response = await getDefaultImages(place.id);
      setImages(response.data);
      setIsDefaultImage(true);
    } catch (error) {
      console.error('Failed to get default images', error);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    (async () => {
      const token = await Preferences.get({ key: 'accessToken' });

      if (!token.value || token.value === 'undefined' || user.id === '0') {
        router.push('/login', 'forward', 'replace');
        return;
      }

      const permissions = await Camera.checkPermissions();
      if (permissions.photos === 'denied' || permissions.camera === 'denied') {
        await Camera.requestPermissions();
      }
    })();
  }, []);

  useEffect(() => {
    if (tourId === 'post') return;

    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    (async () => {
      setFetchImages(false);
      const response = await getTourDetail(tourId, region.countryCode.toUpperCase(), 'ORIGIN');

      setPlace({
        id: response.data.placeInfo.id.toString(),
        title: response.data.placeInfo.name,
        address: response.data.placeInfo.address,
      });
      setTitle(response.data.title);
      setDescription(response.data.description);
      setImages(response.data.placeInfo.imageInfoList);
      setTheme(response.data.theme);
    })();
  }, []);

  useEffect(() => {
    if (!storedPlace.id) return;

    setPlace(storedPlace);
  }, [storedPlace]);

  const uploadPost = () => {
    if (!place.id || !title || !description) {
      console.error('place, title, description are required');
      return;
    }

    storePlace(place);
    storeTitle(title);
    storeDescription(description);
    storeImages(images);

    tourId ? router.push(`/preview-post/${tourId}`) : router.push('/preview-post');
  };

  return (
    <>
      <Header
        fixed
        type="close"
        onClickIcon={() => {
          if (place.id || title || description || images.length) {
            setShowExitAlert(true);
          } else {
            clearAll();
            router.goBack();
          }
        }}
      />

      <div className="flex flex-col items-center px-4 pb-24 mt-16">
        <IonText className="mb-4 font-headline2 text-gray7">{t('newTour.header')}</IonText>

        {place.id ? (
          <PlaceItem id={place.id} text={place.title} description={place.address} />
        ) : (
          <button
            id="search-modal"
            className="w-full py-5 flex items-center justify-center gap-1.5 bg-orange5 rounded-3xl mb-3"
          >
            <IonIcon className="svg-lg" src={PlusCircleWhiteIcon} />
            <IonText className="text-white font-heading">{t('newTour.search')}</IonText>
          </button>
        )}

        {images.length ? (
          <ImageList
            images={images}
            setImages={setImages}
            setFetchImages={setFetchImages}
            openGallerySheet={() => setShowPhotoOptionSheet(true)}
          />
        ) : (
          <UploadImages
            images={images}
            setImages={setImages}
            setFetchImages={setFetchImages}
            openGallerySheet={() => setShowPhotoOptionSheet(true)}
          />
        )}

        <div className="mt-[3.25rem] flex flex-col items-center gap-1 mb-5">
          <IonText className="font-headline2 text-gray7">{t('newTour.detail')}</IonText>
          <IonText className="font-caption2 text-gray6">{t('newTour.translate')}</IonText>
        </div>

        <div className="flex flex-col w-full gap-3">
          <div className="p-3.5 border-[1.5px] border-gray2 rounded-xl">
            <input
              className="w-full h-full bg-white outline-none font-body1 text-gray8"
              placeholder={t('newTour.title')}
              value={title}
              onChange={(e) => setTitle(e.currentTarget.value)}
            />
          </div>
          <div className="h-[8.375rem] border-[1.5px] border-gray2 rounded-xl p-3.5">
            <textarea
              className="w-full h-full bg-white outline-none resize-none font-body1 text-gray8"
              placeholder={t('newTour.description')}
              value={description}
              onChange={(e) => setDescription(e.currentTarget.value)}
            />
          </div>
        </div>
      </div>

      <IonFooter class="ion-no-border" className="fixed bottom-0 left-0 right-0 bg-white">
        <IonToolbar className="p-4 mb-4">
          <button
            className="w-full text-white button-primary button-lg font-subheading1"
            onClick={uploadPost}
            disabled={!place.id || !title || !description}
          >
            {t('common.preview')}
          </button>
        </IonToolbar>
      </IonFooter>

      <SearchPlace
        trigger="search-modal"
        onClickItem={(place) =>
          router.push(
            `/confirm-place?title=${place.title}&address=${place.address}&lat=${place.latitude}&lng=${place.longitude}&id=${place.id}`,
          )
        }
        from="TOUR"
      />

      <IonActionSheet
        isOpen={showPhotoOptionSheet}
        onDidDismiss={() => setShowPhotoOptionSheet(false)}
        header="관련 사진 추가"
        subHeader="직접 찍은 사진이 없다면 구글 이미지를 사용하세요."
        buttons={[
          {
            text: '앨범에서 추가하기',
            handler: selectPhotosFromGallery,
          },
          {
            text: '구글 이미지로 넣기',
            handler: async () => {
              if (images.length) {
                setShowDefaultImageAlert(true);
              } else {
                await getGoogleDefaultImages();
              }
            },
          },
        ]}
      />

      <Alert
        isOpen={showExitAlert}
        title="그만하고 나갈까요?"
        subTitle="지금까지 작성한 내용이 모두 사라져요."
        onDismiss={() => setShowExitAlert(false)}
        buttons={[
          {
            text: '나가기',
            onClick: () => {
              clearAll();
              router.goBack();
            },
          },
          {
            text: '취소',
          },
        ]}
      />

      <Alert
        isOpen={showDefaultImageAlert}
        onDismiss={() => setShowDefaultImageAlert(false)}
        title="이미 앨범에서 추가했어요."
        subTitle="구글 이미지로 변경할 경우 앨범에서 추가한 사진은 모두 삭제 돼요. 계속하시겠어요?"
        buttons={[
          {
            text: '계속',
            onClick: getGoogleDefaultImages,
          },
          {
            text: '취소',
          },
        ]}
      />

      <Toast
        type="error-small"
        message="장소를 먼저 등록해야 해요."
        isOpen={showToast}
        onDismiss={() => setShowToast(false)}
      />
    </>
  );
};

type ImageProps = {
  images: {
    authorName?: string;
    authorUrl?: string;
    imageUrl: string;
  }[];
  setImages: (
    images: {
      authorName?: string;
      authorUrl?: string;
      imageUrl: string;
    }[],
  ) => void;
  setFetchImages: (fetchImages: boolean) => void;
  openGallerySheet: () => void;
};
const UploadImages = ({ images, openGallerySheet }: ImageProps) => {
  const { t } = useTranslation();

  return (
    <div
      className="bg-white border border-gray2 rounded-3xl w-full py-[1.875rem] flex flex-col gap-2 items-center"
      // eslint-disable-next-line @typescript-eslint/no-misused-promises
      onClick={openGallerySheet}
    >
      <div className="bg-gray1.5 px-4 py-3 flex items-center gap-1 w-fit rounded-full">
        <IonIcon src={CameraIcon} className="svg-md" />
        <IonText className="font-body1 text-gray6">{images.length} / 12</IonText>
      </div>
      <IonText className="font-body1 text-gray5.5">{t('newTour.addPictures')}</IonText>
    </div>
  );
};

interface Place {
  id: string;
  text: string;
  description: string;
}
const PlaceItem = ({ text, description }: Place) => {
  return (
    <div
      id="search-modal"
      className="px-4 py-2.5 border-[1.5px] border-gray2 bg-gray1 rounded-3xl flex justify-between items-center w-full mb-3"
    >
      <div className="flex flex-col">
        <IonText className="font-subheading1 text-orange6">{text}</IonText>
        <IonText className="font-caption1 text-gray5.5">{description}</IonText>
      </div>

      <IonIcon icon={RightChevron} className="w-[1.375rem] h-[1.375rem]" />
    </div>
  );
};

const ImageList = ({ images, setImages, setFetchImages, openGallerySheet }: ImageProps) => {
  const { t } = useTranslation();

  const removeImage = (image: string) => {
    setImages(images.filter((img) => img.imageUrl !== image));
    setFetchImages(true);
  };

  return (
    <div className="p-4 flex flex-col gap-3 border-[1.5px] border-gray2 rounded-3xl w-full">
      <div className="flex items-center justify-between">
        <IonText className="font-caption2 text-gray5.5">{t('newTour.policyWarning')}</IonText>

        <div
          className="py-2.5 px-3 flex items-center gap-1 bg-gray1.5 rounded-full shrink-0"
          onClick={openGallerySheet}
        >
          <IonIcon className="svg-md" src={CameraIcon} />
          <IonText className="font-body1 text-gray6">{images.length} / 12</IonText>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-2">
        {images.map((image) => (
          <div key={image.imageUrl} className="relative">
            <IonImg
              src={image.imageUrl}
              className="w-[4.25rem] h-[4.25rem] object-cover rounded-xl overflow-hidden"
            />
            {!image.authorName && (
              <IonIcon
                src={GridDeleteIcon}
                className="absolute svg-md -top-1.5 -right-1.5"
                onClick={() => removeImage(image.imageUrl)}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Post;
