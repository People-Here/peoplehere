import {
  IonActionSheet,
  IonContent,
  IonFooter,
  IonIcon,
  IonImg,
  IonPage,
  IonToolbar,
  useIonRouter,
} from '@ionic/react';
import { useTranslation } from 'react-i18next';
import { useEffect, useMemo, useState } from 'react';
import { useLocation } from 'react-router';
import { Camera } from '@capacitor/camera';

import Header from '../../components/Header';
import usePostPlaceStore from '../../stores/place';
import { getTourDetail } from '../../api/tour';
import useSignInStore from '../../stores/signIn';
import RightChevron from '../../assets/svgs/right-chevron.svg';
import PlusCircleWhiteIcon from '../../assets/svgs/plus-circle-white.svg';
import CameraIcon from '../../assets/svgs/camera.svg';
import GridDeleteIcon from '../../assets/svgs/grid-delete.svg';
import { getDefaultImages } from '../../api/place';
import SearchPlace from '../../modals/SearchPlace';
import Alert from '../../components/Alert';
import Toast from '../../toasts/Toast';

import type { TourDetail } from '../../api/tour';
import type { Image } from './PostPlace';
import type { PlaceItem as PlaceItemType } from '../../modals/SearchPlace';

const EditPost = () => {
  const { t } = useTranslation();
  const router = useIonRouter();
  const location = useLocation();

  const tourId = location.pathname.split('/').pop();

  const {
    setPlace: storePlace,
    setTitle: storeTitle,
    setDescription: storeDescription,
    setImages: storeImages,
    setFetchImages,
    setIsDefaultImage,
    setTheme,
    clearAll,
  } = usePostPlaceStore((state) => state);
  const region = useSignInStore((state) => state.region);

  const [place, setPlace] = useState<PlaceItemType>();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [images, setImages] = useState<Image[]>([]);

  const [showPhotoOptionSheet, setShowPhotoOptionSheet] = useState(false);
  const [showExitAlert, setShowExitAlert] = useState(false);
  const [showDefaultImageAlert, setShowDefaultImageAlert] = useState(false);
  const [showNoGoogleImagesAlert, setShowNoGoogleImagesAlert] = useState(false);
  const [showToast, setShowToast] = useState(false);

  const [initialData, setInitialData] = useState<TourDetail>();

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
    if (!place) {
      setShowToast(true);
      return;
    }

    try {
      const response = await getDefaultImages(place.id);
      setImages(response.data);

      if (response.data.length === 0) {
        setShowNoGoogleImagesAlert(true);
      } else {
        setIsDefaultImage(true);
      }
    } catch (error) {
      console.error('Failed to get default images', error);
    }
  };

  useEffect(() => {
    if (!tourId) return;

    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    (async () => {
      setFetchImages(false);
      const { data } = await getTourDetail(tourId, region.countryCode.toUpperCase(), 'ORIGIN');

      setPlace({
        id: String(data.placeInfo.id),
        title: data.placeInfo.name,
        address: data.placeInfo.address,
      });
      setTitle(data.title);
      setDescription(data.description);
      setImages(data.placeInfo.imageInfoList);
      setTheme(data.theme);

      setInitialData(data);

      if (data.placeInfo.imageInfoList.some((image) => image.authorName)) {
        setIsDefaultImage(true);
      }
    })();
  }, [tourId, region.countryCode, setTheme]);

  const goToPreview = () => {
    if (!place || !title || !description) {
      console.error('place, title, description is required');
      return;
    }

    storePlace(place);
    storeTitle(title);
    storeDescription(description);
    storeImages(images);

    router.push(`/preview-post/${tourId}`);
  };

  const hasUnsavedChange = useMemo(() => {
    if (!initialData) return false;

    return (
      title !== initialData.title ||
      description !== initialData.description ||
      images.length !== initialData.placeInfo.imageInfoList.length ||
      images.at(-1)?.imageUrl !== initialData.placeInfo.imageInfoList.at(-1)?.imageUrl ||
      place?.id !== String(initialData.placeInfo.id)
    );
  }, [description, images, initialData, place, title]);

  return (
    <IonPage>
      <IonContent>
        <Header
          fixed
          type="close"
          onClickIcon={() => {
            if (hasUnsavedChange) {
              setShowExitAlert(true);
            } else {
              clearAll();
              router.goBack();
            }
          }}
        />

        <div className="flex flex-col items-center px-4 pb-24 mt-16">
          <p className="mb-4 font-headline2 text-gray7">{t('posting.header1')}</p>

          {place ? (
            <PlaceItem id={place.id} text={place.title} description={place.address} />
          ) : (
            <button className="w-full py-5 flex items-center justify-center gap-1.5 bg-orange5 rounded-3xl mb-3">
              <IonIcon className="svg-lg" icon={PlusCircleWhiteIcon} />
              <p className="text-white font-heading">{t('newPost.place.title')}</p>
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
            <p className="font-headline2 text-gray7">{t('posting.header2')}</p>
            <p className="font-caption2 text-gray6">{t('posting.translation')}</p>
          </div>

          <div className="flex flex-col w-full gap-3">
            <div className="p-3.5 border-[1.5px] border-gray2 rounded-xl">
              <input
                className="w-full h-full bg-white outline-none font-body1 text-gray8"
                placeholder={t('posting.title')}
                value={title}
                onChange={(e) => setTitle(e.currentTarget.value)}
              />
            </div>
            <div className="h-[8.375rem] border-[1.5px] border-gray2 rounded-xl p-3.5">
              <textarea
                className="w-full h-full bg-white outline-none resize-none font-body1 text-gray8"
                placeholder={t('posting.description')}
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
              onClick={goToPreview}
              disabled={!place || !title || !description}
            >
              {t('posting.preview.title')}
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
          header={t('posting.photos.title')}
          subHeader={t('posting.photos.detail')}
          buttons={[
            {
              text: t('posting.photos.album'),
              handler: selectPhotosFromGallery,
            },
            {
              text: t('posting.photos.googlephotos'),
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
          title={t('editPost.unsaved')}
          onDismiss={() => setShowExitAlert(false)}
          buttons={[
            {
              text: t('newPost.exit.confirm'),
              onClick: () => {
                clearAll();
                router.goBack();
              },
            },
            {
              text: t('progress.cancel'),
            },
          ]}
        />

        <Alert
          isOpen={showDefaultImageAlert}
          onDismiss={() => setShowDefaultImageAlert(false)}
          title={t('posting.photos.switchingP1')}
          subTitle={t('posting.photos.switchingP2')}
          buttons={[
            {
              text: t('progress.continue'),
              onClick: getGoogleDefaultImages,
            },
            {
              text: t('progress.cancel'),
            },
          ]}
        />

        <Alert
          isOpen={showNoGoogleImagesAlert}
          onDismiss={() => setShowNoGoogleImagesAlert(false)}
          title={t('posting.photos.noGoogleP1')}
          subTitle={t('posting.photos.noGoogleP2')}
          buttons={[
            {
              text: t('progress.confirm'),
            },
          ]}
        />

        <Toast
          type="error-small"
          message="장소를 먼저 등록해야 해요."
          isOpen={showToast}
          onDismiss={() => setShowToast(false)}
        />
      </IonContent>
    </IonPage>
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
        <p className="font-subheading1 text-orange6">{text}</p>
        <p className="font-caption1 text-gray5.5">{description}</p>
      </div>

      <IonIcon icon={RightChevron} className="w-[1.375rem] h-[1.375rem]" />
    </div>
  );
};

type ImageProps = {
  images: Image[];
  setImages: (images: Image[]) => void;
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
        <p className="font-body1 text-gray6">{images.length} / 12</p>
      </div>
      <p className="font-body1 text-gray5.5">{t('posting.photos.title')}</p>
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
        <p className="font-caption2 text-gray5.5 pr-1">{t('posting.photos.policy')}</p>

        <div
          className="py-2.5 px-3 flex items-center gap-1 bg-gray1.5 rounded-full shrink-0"
          onClick={openGallerySheet}
        >
          <IonIcon className="svg-md" src={CameraIcon} />
          <p className="font-body1 text-gray6">{images.length} / 12</p>
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

export default EditPost;
