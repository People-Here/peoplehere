import { IonContent, IonPage, useIonRouter } from '@ionic/react';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import Header from '../../components/Header';
import { updateAlarmStatus } from '../../api/alarm';
import { getNewToken } from '../../api/login';
import { getUserProfile } from '../../api/profile';
import useUserStore from '../../stores/user';
import useSignInStore from '../../stores/signIn';

import type { ProfileResponse } from '../../api/profile';
import type { AlarmType } from '../../api/alarm';
import type { AxiosError } from 'axios';

const ManageAlerts = () => {
  const { t } = useTranslation();
  const router = useIonRouter();

  const user = useUserStore((state) => state.user);
  const region = useSignInStore((state) => state.region);

  const [userConsentInfo, setUserConsentInfo] = useState<ProfileResponse['consentInfo']>({
    privacyConsent: false,
    marketingConsent: false,
    messageAlarmConsent: false,
    meetingAlarmConsent: false,
  });

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    fetchConsentInfo();
  }, [user.id, region.countryCode]);

  const fetchConsentInfo = async () => {
    try {
      const response = await getUserProfile(user.id, region.countryCode);
      setUserConsentInfo(response.data.consentInfo);
    } catch (error) {
      const errorInstance = error as AxiosError;

      if (errorInstance.response?.status === 403) {
        console.warn('try to get new token...');

        try {
          await getNewToken();
          const response = await getUserProfile(user.id, region.countryCode);
          setUserConsentInfo(response.data.consentInfo);
        } catch (error) {
          console.error('user token has expired');
          const errorInstance = error as AxiosError;
          if (errorInstance.response?.status === 400) {
            router.push('/login');
          }
        }
      }
    }
  };

  return (
    <IonPage>
      <IonContent fullscreen>
        <Header type="back" title={t('notification.title')} />

        <div className="px-4">
          {/* <ListItem
            title="약속 관련 알림"
            content="다가오는 약속에 대한 리마인더, 약속 취소, 일정 변경 등 약속과 관련된 알림을 받습니다."
            onOff={true}
          /> */}
          <ListItem
            title={t('notification.messages')}
            content={t('notification.messages2')}
            onOff={userConsentInfo.messageAlarmConsent}
            onChange={() =>
              setUserConsentInfo((prev) => ({
                ...prev,
                messageAlarmConsent: !prev.messageAlarmConsent,
              }))
            }
            type="MESSAGE"
            triggerFetch={fetchConsentInfo}
          />
          <ListItem
            title={t('notification.marketing')}
            content={t('notification.marketing2')}
            onOff={userConsentInfo.marketingConsent}
            onChange={() =>
              setUserConsentInfo((prev) => ({
                ...prev,
                marketingConsent: !prev.messageAlarmConsent,
              }))
            }
            type="MARKETING"
            triggerFetch={fetchConsentInfo}
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
  onChange: () => void;
  type: AlarmType;
  triggerFetch: () => Promise<void>;
};
const ListItem = ({ title, content, onOff, onChange, type, triggerFetch }: ListItemProps) => {
  const updateAlert = async (type: AlarmType, onOff: boolean) => {
    try {
      await updateAlarmStatus({ type, consent: onOff });
    } catch (error) {
      const errorInstance = error as AxiosError;

      if (errorInstance.response?.status === 403) {
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
        onOff={onOff}
        onChange={async () => {
          await updateAlert(type, !onOff);
          onChange();
          await triggerFetch();
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
