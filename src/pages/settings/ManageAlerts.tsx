import { IonContent, IonPage } from '@ionic/react';
import { useState } from 'react';

import Header from '../../components/Header';
import { updateAlarmStatus } from '../../api/alarm';
import { getNewToken } from '../../api/login';

import type { AxiosError } from 'axios';
import type { AlarmType } from '../../api/alarm';

const ManageAlerts = () => {
  return (
    <IonPage>
      <IonContent fullscreen>
        <Header type="back" title="알림" />

        <div className="px-4">
          {/* <ListItem
            title="약속 관련 알림"
            content="다가오는 약속에 대한 리마인더, 약속 취소, 일정 변경 등 약속과 관련된 알림을 받습니다."
            onOff={true}
          /> */}
          <ListItem
            title="새로운 쪽지 알림"
            content="다른 사용자가 보낸 쪽지에 대한 알림을 받습니다."
            onOff={true}
            type="MESSAGE"
          />
          <ListItem
            title="마케팅 정보 수신"
            content="피플히어의 업데이트 소식, 이벤트, 프로모션 등 마케팅과 관련된 알림을 받습니다."
            onOff={true}
            type="MARKETING"
          />
        </div>
      </IonContent>
    </IonPage>
  );
};

type ListItemProps = {
  title: string;
  content: string;
  onOff: boolean;
  type: AlarmType;
};
const ListItem = ({ title, content, onOff, type }: ListItemProps) => {
  const [isOn, setIsOn] = useState(onOff);

  const updateAlert = async (type: AlarmType, onOff: boolean) => {
    try {
      await updateAlarmStatus({ type, consent: onOff });
    } catch (error) {
      const errorInstance = error as AxiosError;

      if (errorInstance.response?.status === 401) {
        await getNewToken();
        await updateAlarmStatus({ type, consent: onOff });
      }

      console.error('fail to update alarm', error);
    }
  };

  return (
    <div className="flex gap-4 justify-between py-5 border-b border-gray1.5 w-full">
      <div>
        <p className="mb-1 text-black font-subheading2">{title}</p>
        <p className="font-caption2 text-gray5.5">{content}</p>
      </div>

      <Switch
        onOff={isOn}
        onChange={async () => {
          await updateAlert(type, !isOn);
          setIsOn((prev) => !prev);
        }}
      />
    </div>
  );
};

const Switch = ({ onOff, onChange }: { onOff: boolean; onChange: () => void }) => {
  return (
    <div
      className={
        onOff
          ? 'relative w-12 px-0.5 rounded-full h-7 shrink-0 bg-orange5 transition-all duration-300'
          : 'relative w-12 px-0.5 rounded-full h-7 shrink-0 bg-gray5 transition-all duration-300'
      }
      onClick={onChange}
    >
      <span
        className="absolute w-6 transition-all duration-300 ease-in-out bg-white rounded-full aspect-square top-1/2"
        style={onOff ? { transform: 'translate(20px, -50%)' } : { transform: 'translateY(-50%)' }}
      />
      {/* <span className="absolute w-6 transition-all duration-300 ease-in-out translate-x-full -translate-y-1/2 bg-white rounded-full aspect-square top-1/2" /> */}
    </div>
  );
};

export default ManageAlerts;
