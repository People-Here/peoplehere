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
import { FirebaseAnalytics } from '@capacitor-community/firebase-analytics';

import Header from '../../components/Header';
import PlusCircleWhiteIcon from '../../assets/svgs/plus-circle-white.svg';
import CameraIcon from '../../assets/svgs/camera.svg';
import RightChevron from '../../assets/svgs/right-chevron.svg';
import GridDeleteIcon from '../../assets/svgs/grid-delete.svg';
import useUserStore from '../../stores/user';
import usePostPlaceStore from '../../stores/place';
import SearchPlace from '../../modals/SearchPlace';
import Alert from '../../components/Alert';
import { getDefaultImages } from '../../api/place';
import Toast from '../../toasts/Toast';

import type { PlaceItem as PlaceItemType } from '../../modals/SearchPlace';

export type Image = {
  imageUrl: string;
  authorName?: string;
  authorUrl?: string;
};

const Post = () => {
  const { t } = useTranslation();

  const router = useIonRouter();

  const user = useUserStore((state) => state.user);
  const {
    place: storedPlace,
    setPlace: storePlace,
    title: storedTitle,
    setTitle: storeTitle,
    description: storedDescription,
    setDescription: storeDescription,
    images: storedImages,
    setImages: storeImages,
    isDefaultImage,
    setIsDefaultImage,
    clearAll,
  } = usePostPlaceStore((state) => state);

  const [place, setPlace] = useState<PlaceItemType>(
    storedPlace ?? { id: '', text: '', description: '', latitude: 0, longitude: 0 },
  );

  const [title, setTitle] = useState(storedTitle ?? '');
  const [description, setDescription] = useState(storedDescription ?? '');
  const [images, setImages] = useState<Image[]>(storedImages ?? null);

  const [showSearchModal, setShowSearchModal] = useState(false);
  const [showPhotoOptionSheet, setShowPhotoOptionSheet] = useState(false);
  const [showExitAlert, setShowExitAlert] = useState(false);
  const [showDefaultImageAlert, setShowDefaultImageAlert] = useState(false);
  const [showNoGoogleImagesAlert, setShowNoGoogleImagesAlert] = useState(false);
  const [showToast, setShowToast] = useState(false);

  const selectPhotosFromGallery = async () => {
    const selectedImages = await Camera.pickImages({
      limit: isDefaultImage ? 12 : 12 - images.length,
    });

    if (selectedImages.photos.length > 0) {
      await FirebaseAnalytics.logEvent({
        name: 'add_photo_complete',
        params: {
          photo_method: 'from_gallery',
          photo_count: selectedImages.photos.length,
        },
      });
    }

    setImages((prev) => [
      ...prev,
      ...selectedImages.photos.map((photo) => ({ imageUrl: photo.webPath })),
    ]);
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

      if (response.data.length === 0) {
        setShowNoGoogleImagesAlert(true);
      } else {
        setIsDefaultImage(true);

        await FirebaseAnalytics.logEvent({
          name: 'add_photo_complete',
          params: {
            photo_method: 'from_google',
            photo_count: response.data.length,
          },
        });
      }
    } catch (error) {
      console.error('Failed to get default images', error);
    }
  };

  const onClickSearchPlace = async () => {
    await FirebaseAnalytics.logEvent({
      name: 'click_add_post',
      params: {},
    });
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
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    (async () => {
      await FirebaseAnalytics.setScreenName({
        screenName: 'create_post',
        nameOverride: 'CreatePost',
      });
    })();
  }, []);

  useEffect(() => {
    if (!storedPlace.id) return;

    setPlace(storedPlace);
  }, [storedPlace]);

  const goToPreview = async () => {
    await FirebaseAnalytics.logEvent({
      name: 'click_preview',
      params: {},
    });

    if (!place.id || !title || !description) {
      console.error('place, title, description are required');
      return;
    }

    storePlace(place);
    storeTitle(title);
    storeDescription(description);
    storeImages(images);

    router.push('/preview-post');
  };

  const onClickExit = async () => {
    await FirebaseAnalytics.logEvent({
      name: 'click_close_create_post',
      params: {
        fill_create_post: Boolean(hasUnsavedChange),
      },
    });
  };

  const hasUnsavedChange = place.id || title || description || images.length;

  return (
    <>
      <Header
        fixed
        type="close"
        onClickIcon={async () => {
          await onClickExit();

          if (hasUnsavedChange) {
            setShowExitAlert(true);
          } else {
            clearAll();
            router.goBack();
          }
        }}
      />

      <div className="flex flex-col items-center px-4 pb-24 mt-16">
        <IonText className="mb-4 font-headline2 text-gray7">{t('posting.header1')}</IonText>

        {place.id ? (
          <PlaceItem
            id={place.id}
            text={place.title}
            description={place.address}
            openSearchModal={setShowSearchModal}
          />
        ) : (
          <button
            className="w-full py-5 flex items-center justify-center gap-1.5 bg-orange5 rounded-3xl mb-3"
            onClick={async () => {
              await onClickSearchPlace();
              setShowSearchModal(true);
            }}
          >
            <IonIcon className="svg-lg" src={PlusCircleWhiteIcon} />
            <IonText className="text-white font-heading">{t('newPost.place.title')}</IonText>
          </button>
        )}

        {images.length ? (
          <ImageList
            images={images}
            setImages={setImages}
            openGallerySheet={() => setShowPhotoOptionSheet(true)}
          />
        ) : (
          <UploadImages
            images={images}
            setImages={setImages}
            openGallerySheet={() => setShowPhotoOptionSheet(true)}
          />
        )}

        <div className="mt-[52px] flex flex-col items-center gap-1 mb-5">
          <IonText className="font-headline2 text-gray7">{t('posting.header2')}</IonText>
          <IonText className="font-caption2 text-gray6">{t('posting.translation')}</IonText>
        </div>

        <div className="flex flex-col w-full gap-3">
          <div>
            <input
              className="w-full h-full bg-white outline-none font-body1 text-gray8 p-3.5 border-[.0938rem] border-gray2 rounded-xl"
              placeholder={t('posting.title')}
              value={title}
              onChange={(e) => setTitle(e.currentTarget.value)}
              maxLength={40}
              onClick={async () => {
                await FirebaseAnalytics.logEvent({
                  name: 'input_title',
                  params: {},
                });
              }}
            />
            <p className="mt-1 text-right font-caption2 text-gray5">{title.length}/40</p>
          </div>
          <div>
            <textarea
              className="w-full bg-white outline-none resize-none font-body1 text-gray8 h-[134px] border-[.0938rem] border-gray2 rounded-xl p-3.5"
              placeholder={t('posting.description')}
              value={description}
              onChange={(e) => setDescription(e.currentTarget.value)}
              maxLength={300}
              onClick={async () => {
                await FirebaseAnalytics.logEvent({
                  name: 'input_detail',
                  params: {},
                });
              }}
            />
            <p className="text-right font-caption2 text-gray5">{description.length}/300</p>
          </div>
        </div>
      </div>

      <IonFooter class="ion-no-border" className="fixed bottom-0 left-0 right-0 bg-white">
        <IonToolbar className="p-4 mb-4">
          <button
            className="w-full text-white button-primary button-lg font-subheading1"
            onClick={goToPreview}
            disabled={!place.id || !title || !description}
          >
            {t('posting.preview.title')}
          </button>
        </IonToolbar>
      </IonFooter>

      <SearchPlace
        isOpen={showSearchModal}
        onDidDismiss={() => setShowSearchModal(false)}
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
        buttons={
          isDefaultImage
            ? [
                {
                  text: t('posting.photos.album'),
                  handler: selectPhotosFromGallery,
                },
              ]
            : [
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
              ]
        }
      />

      <Alert
        isOpen={showExitAlert}
        title={t('newPost.exit.p1')}
        subTitle={t('newPost.exit.p2')}
        onDismiss={() => setShowExitAlert(false)}
        buttons={[
          {
            text: t('newPost.exit.confirm'),
            onClick: async () => {
              await FirebaseAnalytics.logEvent({
                name: 'close_popup_close_create_post',
                params: {},
              });
              clearAll();
              router.goBack();
            },
          },
          {
            text: t('progress.cancel'),
            onClick: async () => {
              await FirebaseAnalytics.logEvent({
                name: 'close_popup_cancel_create_post',
                params: {},
              });
            },
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
    </>
  );
};

type ImageProps = {
  images: Image[];
  setImages: (images: Image[]) => void;
  openGallerySheet: () => void;
};
const UploadImages = ({ images, openGallerySheet }: ImageProps) => {
  const { t } = useTranslation();

  const onClickAddImage = async () => {
    await FirebaseAnalytics.logEvent({
      name: 'click_add_photo',
      params: {},
    });
  };

  return (
    <div
      className="bg-white border border-gray2 rounded-3xl w-full py-[30px] flex flex-col gap-2 items-center"
      // eslint-disable-next-line @typescript-eslint/no-misused-promises
      onClick={async () => {
        await onClickAddImage();
        openGallerySheet();
      }}
    >
      <div className="bg-gray1.5 px-4 py-3 flex items-center gap-1 w-fit rounded-full">
        <IonIcon src={CameraIcon} className="svg-md" />
        <IonText className="font-body1 text-gray6">{images.length} / 12</IonText>
      </div>
      <IonText className="font-body1 text-gray5.5">{t('posting.photos.title')}</IonText>
    </div>
  );
};

interface Place {
  id: string;
  text: string;
  description: string;
  openSearchModal: (open: boolean) => void;
}
const PlaceItem = ({ text, description, openSearchModal }: Place) => {
  return (
    <div
      className="px-4 py-2.5 border-[.0938rem] border-gray2 bg-gray1 rounded-3xl flex justify-between items-center w-full mb-3"
      onClick={() => openSearchModal(true)}
    >
      <div className="flex flex-col">
        <IonText className="font-subheading1 text-orange6">{text}</IonText>
        <IonText className="font-caption1 text-gray5.5">{description}</IonText>
      </div>

      <IonIcon icon={RightChevron} className="w-[22px] h-[22px]" />
    </div>
  );
};

const ImageList = ({ images, setImages, openGallerySheet }: ImageProps) => {
  const { t } = useTranslation();

  const removeImage = (image: string) => {
    setImages(images.filter((img) => img.imageUrl !== image));
  };

  return (
    <div className="p-4 flex flex-col gap-3 border-[.0938rem] border-gray2 rounded-3xl w-full">
      <div className="flex items-center justify-between">
        <IonText className="font-caption2 text-gray5.5 pr-1">{t('posting.photos.policy')}</IonText>

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
              className="w-[68px] h-[68px] object-cover rounded-xl overflow-hidden"
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
