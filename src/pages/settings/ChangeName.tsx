import { IonContent, IonPage, useIonRouter } from '@ionic/react';
import { useLayoutEffect, useState } from 'react';

import Header from '../../components/Header';
import LabelInput from '../../components/LabelInput';
import Footer from '../../layouts/Footer';
import useUserStore from '../../stores/user';
import { updateUserName } from '../../api/profile';

const ChangeName = () => {
  const router = useIonRouter();
  const { user, setUser } = useUserStore((state) => state);

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');

  useLayoutEffect(() => {
    if (!user) return;

    setFirstName(user.firstName);
    setLastName(user.lastName);
  }, [user]);

  const updateName = async () => {
    try {
      await updateUserName(firstName, lastName);
      setUser({ ...user, firstName, lastName });
      router.goBack();
    } catch (error) {
      console.error('fail to update name', error);
    }
  };

  return (
    <IonPage>
      <IonContent fullscreen>
        <Header type="close" title="이름 수정" />

        <div className="flex flex-col gap-3 px-4 mt-4">
          <LabelInput value={firstName} onChange={setFirstName} label="이름" />
          <LabelInput value={lastName} onChange={setLastName} label="성" />
        </div>

        <Footer>
          <button className="w-full button-primary button-lg" onClick={updateName}>
            저장
          </button>
        </Footer>
      </IonContent>
    </IonPage>
  );
};

export default ChangeName;
