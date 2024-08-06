import {
  IonContent,
  IonFooter,
  IonIcon,
  IonPage,
  IonText,
  IonToolbar,
  useIonRouter,
} from '@ionic/react';
import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Preferences } from '@capacitor/preferences';
import { useTranslation } from 'react-i18next';

import packageJSON from '../../../package.json';
import Header from '../../components/Header';
import UserIcon from '../../assets/svgs/user.svg';
import BellIcon from '../../assets/svgs/bell.svg';
import CustomerSupportIcon from '../../assets/svgs/customer-support.svg';
import PaperIcon from '../../assets/svgs/paper.svg';
import LogoBlackIcon from '../../assets/svgs/logo-black.svg';
import useUserStore from '../../stores/user';
import DeleteUser from '../../modals/DeleteUser';
import Alert from '../../components/Alert';
import { deleteAccount } from '../../api/sign-up';
import useLogin from '../../hooks/useLogin';
import { getNewToken } from '../../api/login';
import LanguageIcon from '../../assets/svgs/language.svg';

import type { AxiosError } from 'axios';

const Settings = () => {
  const { t } = useTranslation();
  const router = useIonRouter();

  const { id } = useUserStore((state) => state.user);
  const { requestLogout } = useLogin();

  const [isLogin, setIsLogin] = useState(false);
  const [openLogoutModal, setOpenLogoutModal] = useState(false);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [openDeleteReasonSheet, setOpenDeleteReasonSheet] = useState(false);

  const [deleteReason, setDeleteReason] = useState('');

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    (async () => {
      const { value } = await Preferences.get({ key: 'accessToken' });

      if (id && value && value !== 'undefined') {
        setIsLogin(true);
      }
    })();
  }, [id]);

  return (
    <IonPage>
      <IonContent fullscreen>
        <Header type="close" fixed />

        <div className="px-4 mt-14">
          <IonText className="mt-1 font-headline1 text-gray8">환경 설정</IonText>

          <div className="mt-4">
            <MenuItem
              title={t('personal.title')}
              icon={UserIcon}
              routeTo="/settings/informations"
            />
            <MenuItem
              title={t('translation.title')}
              icon={LanguageIcon}
              routeTo="/settings/translate"
            />
            <MenuItem title={t('notification.title')} icon={BellIcon} routeTo="/settings/alert" />
            <MenuItem
              title={t('contactUs.title')}
              icon={CustomerSupportIcon}
              routeTo="/settings/support"
            />
            <MenuItem title={t('legal.title')} icon={PaperIcon} routeTo="/settings/policy" />
          </div>
        </div>

        <IonFooter class="ion-no-border" className="fixed bottom-0 left-0 right-0 bg-white">
          <IonToolbar className="px-4 py-7">
            {isLogin ? (
              <button
                className="w-full mb-4 button-gray button-lg font-subheading1 text-gray6"
                onClick={() => setOpenLogoutModal(true)}
              >
                {t('user.logout')}
              </button>
            ) : (
              <Link to="/login">
                <button className="w-full mb-4 button-sub button-lg font-subheading1 text-orange5">
                  {t('user.login')}
                </button>
              </Link>
            )}

            <div className="flex items-center justify-center gap-2 mb-2">
              <IonIcon src={LogoBlackIcon} className="svg-md" />
              <p className="font-suite text-base font-extrabold leading-[1.625rem] -tracking-[0.0125rem]">
                PeopleHere
              </p>
            </div>

            <div className="flex flex-col items-center mb-2">
              <p className="font-caption2 text-gray5.5">
                {t('settings.version')} {packageJSON.version}
              </p>
              <p className="font-caption2 text-gray5.5">{t('settings.phrase')}</p>
            </div>

            {isLogin ? (
              <p
                className="text-center underline font-caption1 text-gray5.5"
                onClick={() => setOpenDeleteReasonSheet(true)}
              >
                {t('deleteAccount.title')}
              </p>
            ) : (
              <Link to="/sign-up/email">
                <p className="text-center underline font-caption1 text-gray5.5">
                  {t('user.signup')}
                </p>
              </Link>
            )}
          </IonToolbar>
        </IonFooter>

        <DeleteUser
          isOpen={openDeleteReasonSheet}
          closeModal={() => setOpenDeleteReasonSheet(false)}
          onConfirm={() => setOpenDeleteModal(true)}
          setReason={setDeleteReason}
        />

        <Alert
          isOpen={openDeleteModal}
          title={t('deleteAccount.confirm')}
          subTitle={t('deleteAccount.confirmDetail')}
          buttons={[
            {
              text: t('deleteAccount.complete'),
              onClick: async () => {
                try {
                  await deleteAccount(id, deleteReason);
                  await requestLogout();
                  router.push('/login', 'forward', 'replace');
                } catch (error) {
                  const errorInstance = error as AxiosError;

                  if (errorInstance.response?.status === 403) {
                    await getNewToken();
                    await deleteAccount(id, deleteReason);
                    await requestLogout();
                    router.push('/login', 'forward', 'replace');
                  }

                  console.error('delete account error:', error);
                }
              },
            },
            {
              text: t('progress.cancel'),
            },
          ]}
          onDismiss={() => {
            setOpenDeleteModal(false);
          }}
        />

        <Alert
          isOpen={openLogoutModal}
          title="로그아웃 하시겠어요?"
          buttons={[
            {
              text: '취소',
            },
            {
              text: '로그아웃',
              onClick: requestLogout,
            },
          ]}
          onDismiss={() => setOpenLogoutModal(false)}
        />
      </IonContent>
    </IonPage>
  );
};

type MenuItemProps = {
  title: string;
  icon: string;
  routeTo: string;
};
const MenuItem = ({ title, icon, routeTo }: MenuItemProps) => {
  return (
    <Link
      to={routeTo}
      className="w-full py-5 flex items-center gap-4 border-b border-gray1.5 bg-white"
    >
      <IonIcon icon={icon} className="svg-lg" />
      <p className="font-subheading2 text-gray8">{title}</p>
    </Link>
  );
};

export default Settings;
