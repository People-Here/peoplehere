import { IonCol, IonGrid, IonIcon, IonImg, IonRow, IonText, useIonRouter } from '@ionic/react';
import { useEffect, useState } from 'react';
import { Camera } from '@capacitor/camera';

import Header from '../../components/Header';
import PlusCircleWhiteIcon from '../../assets/svgs/plus-circle-white.svg';
import CameraIcon from '../../assets/svgs/camera.svg';
import Footer from '../../layouts/Footer';
import RightChevron from '../../assets/svgs/right-chevron.svg';
import GridDeleteIcon from '../../assets/svgs/grid-delete.svg';

const place = {
  id: 123,
  text: '로니로티 건대점',
  description: '서울 광진구 아차산로 225 단산화빌딩',
};

const Post = () => {
  const router = useIonRouter();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [images, setImages] = useState<string[]>([]);

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    (async () => {
      const permissions = await Camera.checkPermissions();
      if (permissions.photos === 'denied' || permissions.camera === 'denied') {
        await Camera.requestPermissions();
      }
    })();
  }, []);

  return (
    <>
      <Header type="close" />

      <div className="flex flex-col items-center px-4">
        <IonText className="mb-4 font-headline2 text-gray7">외국인과 어디서 만날까?</IonText>

        {place ? (
          <PlaceItem id={place.id} text={place.text} description={place.description} />
        ) : (
          <button
            className="w-full py-5 flex items-center justify-center gap-1.5 bg-orange5 rounded-3xl mb-3"
            onClick={() => {
              router.push('/search');
            }}
          >
            <IonIcon className="svg-lg" src={PlusCircleWhiteIcon} />
            <IonText className="text-white font-heading">장소 등록</IonText>
          </button>
        )}

        {images.length ? (
          <ImageList images={images} setImages={setImages} />
        ) : (
          <UploadImages images={images} setImages={setImages} />
        )}

        <div className="mt-[3.25rem] flex flex-col items-center gap-1 mb-5">
          <IonText className="font-headline2 text-gray7">여기서 같이 뭐하면 좋을까?</IonText>
          <IonText className="font-caption2 text-gray6">
            한글로 작성할 경우 자동으로 영문 번역될 수 있어요.
          </IonText>
        </div>

        <div className="flex flex-col w-full gap-3">
          <div className="p-3.5 border-[1.5px] border-gray2 rounded-xl">
            <input
              className="w-full h-full outline-none font-body1 text-gray8"
              placeholder="짧고 재치있는 한 줄 제목"
              value={title}
              onChange={(e) => setTitle(e.currentTarget.value)}
            />
          </div>
          <div className="h-[8.375rem] border-[1.5px] border-gray2 rounded-xl p-3.5">
            <textarea
              className="w-full h-full outline-none resize-none font-body1 text-gray8"
              placeholder="함께 하고 싶은 활동에 대해 얘기해 보세요."
              value={description}
              onChange={(e) => setDescription(e.currentTarget.value)}
            />
          </div>
        </div>
      </div>

      <Footer>
        <button className="w-full button-primary button-lg">미리보기</button>
      </Footer>
    </>
  );
};

type ImageProps = {
  images: string[];
  setImages: (images: string[]) => void;
};
const UploadImages = ({ setImages }: ImageProps) => {
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
        <IonText className="font-body1 text-gray6">0 / 12</IonText>
      </div>
      <IonText className="font-body1 text-gray5.5">관련 사진을 추가하세요</IonText>
    </div>
  );
};

interface Place {
  id: number;
  text: string;
  description: string;
}
const PlaceItem = ({ text, description }: Place) => {
  return (
    <div className="px-4 py-2.5 border-[1.5px] border-gray2 bg-gray1 rounded-3xl flex justify-between items-center w-full mb-3">
      <div className="flex flex-col">
        <IonText className="font-subheading1 text-orange6">{text}</IonText>
        <IonText className="font-caption1 text-gray5.5">{description}</IonText>
      </div>

      <IonIcon icon={RightChevron} className="w-[1.375rem] h-[1.375rem]" />
    </div>
  );
};

const ImageList = ({ images, setImages }: ImageProps) => {
  return (
    <div className="p-4 flex flex-col gap-3 border-[1.5px] border-gray2 rounded-3xl">
      <div className="flex items-center justify-center">
        <IonText className="font-caption2 text-gray5.5">
          저작권법 위반 시 임의로 삭제될 수 있어요.
        </IonText>

        <div className="py-2.5 px-3 flex items-center gap-1">
          <IonIcon className="svg-md" src={CameraIcon} />
          <IonText className="font-body1 text-gray6">{images.length} / 12</IonText>
        </div>
      </div>

      <IonGrid>
        <IonRow>
          {images.map((image) => (
            <IonCol key={image} className="relative">
              <IonImg src={image} className="w-[4.25rem] h-[4.25rem] object-cover" />
              <IonIcon src={GridDeleteIcon} className="absolute svg-md -top-0.5 -right-0.5" />
            </IonCol>
          ))}
        </IonRow>
      </IonGrid>
    </div>
  );
};

export default Post;
