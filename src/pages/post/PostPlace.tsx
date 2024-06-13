import { IonIcon, IonImg, IonText, useIonRouter } from '@ionic/react';
import { useEffect, useState } from 'react';
import { Camera } from '@capacitor/camera';
import { Preferences } from '@capacitor/preferences';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router';

import Header from '../../components/Header';
import PlusCircleWhiteIcon from '../../assets/svgs/plus-circle-white.svg';
import CameraIcon from '../../assets/svgs/camera.svg';
import Footer from '../../layouts/Footer';
import RightChevron from '../../assets/svgs/right-chevron.svg';
import GridDeleteIcon from '../../assets/svgs/grid-delete.svg';
import useUserStore from '../../stores/user';
import usePostPlaceStore from '../../stores/place';
import { getTourDetail } from '../../api/tour';
import useSignInStore from '../../stores/signIn';
import SearchPlace from '../../modals/SearchPlace';
import Alert from '../../components/Alert';

import type { PlaceItem as PlaceItemType } from '../../modals/SearchPlace';

const Post = () => {
  const { t } = useTranslation();

  const router = useIonRouter();
  const location = useLocation();

  const tourId = location.pathname.split('/').at(-1) ?? '';

  const user = useUserStore((state) => state.user);
  const region = useSignInStore((state) => state.region);
  const {
    setPlace: storePlace,
    setTitle: storeTitle,
    setDescription: storeDescription,
    setImages: storeImages,
    setFetchImages,
  } = usePostPlaceStore((state) => state);

  const [place, setPlace] = useState<PlaceItemType>({ id: '', title: '', address: '' });

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [images, setImages] = useState<string[]>([]);

  const [showExitAlert, setShowExitAlert] = useState(false);

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
      setImages(response.data.placeInfo.imageUrlList.map((image) => image.imageUrl));
    })();
  }, []);

  const uploadPost = () => {
    if (!place.id || !images.length || !title || !description) {
      console.error('place, images, title, description are required');
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
      <Header type="close" onClickIcon={() => setShowExitAlert(true)} />

      <div className="flex flex-col items-center px-4 pb-24">
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
          <ImageList images={images} setImages={setImages} setFetchImages={setFetchImages} />
        ) : (
          <UploadImages images={images} setImages={setImages} setFetchImages={setFetchImages} />
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

      <Footer>
        <button
          className="w-full text-white button-primary button-lg font-subheading1"
          onClick={uploadPost}
          disabled={!place.id || !images.length || !title || !description}
        >
          {t('common.preview')}
        </button>
      </Footer>

      <SearchPlace trigger="search-modal" onClickItem={(place) => setPlace(place)} from="TOUR" />

      <Alert
        isOpen={showExitAlert}
        title="그만하고 나갈까요?"
        subTitle="지금까지 작성한 내용이 모두 사라져요."
        onDismiss={() => setShowExitAlert(false)}
        buttons={[
          {
            text: '나가기',
            onClick: () => router.goBack(),
          },
          {
            text: '취소',
          },
        ]}
      />
    </>
  );
};

type ImageProps = {
  images: string[];
  setImages: (images: string[]) => void;
  setFetchImages: (fetchImages: boolean) => void;
};
const UploadImages = ({ images, setImages }: ImageProps) => {
  const { t } = useTranslation();

  const selectPhotosFromGallery = async () => {
    const selectedImages = await Camera.pickImages({
      limit: 12,
    });

    setImages(selectedImages.photos.map((photo) => photo.webPath));
  };

  return (
    <div
      className="bg-white border border-gray2 rounded-3xl w-full py-[1.875rem] flex flex-col gap-2 items-center"
      // eslint-disable-next-line @typescript-eslint/no-misused-promises
      onClick={selectPhotosFromGallery}
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

const ImageList = ({ images, setImages, setFetchImages }: ImageProps) => {
  const { t } = useTranslation();

  const selectPhotosFromGallery = async () => {
    const selectedImages = await Camera.pickImages({
      limit: 12 - images.length,
    });

    setImages(selectedImages.photos.map((photo) => photo.webPath));
    setFetchImages(true);
  };

  const removeImage = (image: string) => {
    setImages(images.filter((img) => img !== image));
    setFetchImages(true);
  };

  return (
    <div className="p-4 flex flex-col gap-3 border-[1.5px] border-gray2 rounded-3xl w-full">
      <div className="flex items-center justify-between">
        <IonText className="font-caption2 text-gray5.5">{t('newTour.policyWarning')}</IonText>

        <div
          className="py-2.5 px-3 flex items-center gap-1 bg-gray1.5 rounded-full shrink-0"
          onClick={selectPhotosFromGallery}
        >
          <IonIcon className="svg-md" src={CameraIcon} />
          <IonText className="font-body1 text-gray6">{images.length} / 12</IonText>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-2">
        {images.map((image) => (
          <div key={image} className="relative">
            <IonImg
              src={image}
              className="w-[4.25rem] h-[4.25rem] object-cover rounded-xl overflow-hidden"
            />
            <IonIcon
              src={GridDeleteIcon}
              className="absolute svg-md -top-1.5 -right-1.5"
              onClick={() => removeImage(image)}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Post;
