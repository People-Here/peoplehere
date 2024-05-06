import { IonContent, IonPage } from '@ionic/react';
import { useState } from 'react';

import Header from '../../components/Header';
import Footer from '../../layouts/Footer';

const DeleteReason = () => {
  const [input, setInput] = useState('');

  return (
    <IonPage>
      <IonContent fullscreen>
        <Header type="close" title="홍대에서 만나는 디자인과 예술" />

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

        <Footer>
          <button
            className="w-full text-white button-primary button-lg font-subheading1"
            disabled={input.length <= 0}
          >
            삭제하기
          </button>
        </Footer>
      </IonContent>
    </IonPage>
  );
};

export default DeleteReason;
