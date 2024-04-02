import { IonIcon, IonInput, IonText, IonTextarea } from '@ionic/react';
import { useState } from 'react';

import Header from '../../components/Header';
import PlusCircleWhiteIcon from '../../assets/svgs/plus-circle-white.svg';
import CameraIcon from '../../assets/svgs/camera.svg';
import Footer from '../../layouts/Footer';

const Post = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  return (
    <>
      <Header type="close" />

      <div className="flex flex-col items-center px-4">
        <IonText className="mb-4 font-headline2 text-gray7">외국인과 어디서 만날까?</IonText>

        <button className="w-full py-5 flex items-center justify-center gap-1.5 bg-orange5 rounded-3xl mb-3">
          <IonIcon className="svg-lg" src={PlusCircleWhiteIcon} />
          <IonText className="text-white font-heading">장소 등록</IonText>
        </button>

        <UploadImages />

        <div className="mt-[3.25rem] flex flex-col items-center gap-1 mb-5">
          <IonText className="font-headline2 text-gray7">여기서 같이 뭐하면 좋을까?</IonText>
          <IonText className="font-caption2 text-gray6">
            한글로 작성할 경우 자동으로 영문 번역될 수 있어요.
          </IonText>
        </div>

        <div className="flex flex-col w-full gap-3">
          <IonInput
            class="ion-no-padding"
            className="font-body1 text-gray8 border-[1.5px] p-3.5 border-gray2 rounded-xl"
            placeholder="짧고 재치있는 한 줄 제목"
            value={title}
            onIonInput={(e) => setTitle(e.target.value as string)}
          />
          <IonTextarea
            class="ion-no-padding"
            className="font-body1 text-gray8 h-[8.375rem] border-[1.5px] p-3.5 border-gray2 rounded-xl"
            placeholder="함께 하고 싶은 활동에 대해 얘기해 보세요."
            value={description}
            onIonInput={(e) => setDescription(e.target.value as string)}
          />
        </div>
      </div>

      <Footer>
        <button className="w-full button-primary button-lg">미리보기</button>
      </Footer>
    </>
  );
};

const UploadImages = () => {
  return (
    <div className="bg-white border border-gray2 rounded-3xl w-full py-[1.875rem] flex flex-col gap-2 items-center">
      <div className="bg-gray1.5 px-4 py-3 flex items-center gap-1 w-fit rounded-full">
        <IonIcon src={CameraIcon} className="svg-md" />
        <IonText className="font-body1 text-gray6">0 / 12</IonText>
      </div>
      <IonText className="font-body1 text-gray5.5">관련 사진을 추가하세요</IonText>
    </div>
  );
};

export default Post;
