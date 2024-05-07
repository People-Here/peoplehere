import { IonContent, IonPage, useIonRouter } from '@ionic/react';
import { useState } from 'react';
import { useLocation } from 'react-router';
import { Preferences } from '@capacitor/preferences';

import Header from '../../components/Header';
import Footer from '../../layouts/Footer';
import { deleteTour } from '../../api/tour';
import { getNewToken } from '../../api/login';

import type { AxiosError } from 'axios';

const DeleteReason = () => {
  const router = useIonRouter();
  const location = useLocation();
  const tourId = location.pathname.split('/').at(-1) ?? '';

  const [input, setInput] = useState('');

  const onDeleteTour = async (tourId: string) => {
    try {
      await deleteTour(tourId);
      router.push('/profile');
    } catch (error) {
      const errorInstance = error as AxiosError;

      if (errorInstance.response?.status === 401) {
        const response = await getNewToken();
        await Preferences.set({ key: 'accessToken', value: response.data });

        await deleteTour(tourId);
        router.push('/profile');
      }
      console.error('fail to delete tour', error);
    }
  };

  return (
    <IonPage>
      <IonContent fullscreen>
        <Header type="close" title="홍대에서 만나는 디자인과 예술" />

        <div className="px-4">
          <p className="mt-5 font-headline1 text-gray8">삭제하시는 이유를 알려주세요</p>

          <div className="flex gap-1.5 flex-col items-end mt-6">
            <textarea
              className="px-4 py-2.5 rounded-lg bg-gray1.5 border border-gray3 min-h-[8.75rem] font-body1 text-gray8 resize-none w-full"
              value={input}
              onChange={(e) => setInput(e.currentTarget.value)}
              maxLength={30}
            />

            <p className="font-caption2 text-gray5">{input.length}/30</p>
          </div>
        </div>

        <Footer>
          <button
            className="w-full text-white button-primary button-lg font-subheading1"
            disabled={input.length <= 0}
            onClick={() => onDeleteTour(tourId)}
          >
            삭제하기
          </button>
        </Footer>
      </IonContent>
    </IonPage>
  );
};

export default DeleteReason;
