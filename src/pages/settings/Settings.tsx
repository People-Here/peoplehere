import { IonContent, IonIcon, IonPage, IonText, useIonRouter } from '@ionic/react';
import { Link } from 'react-router-dom';
import { useEffect, useRef, useState } from 'react';
import { Preferences } from '@capacitor/preferences';

import Header from '../../components/Header';
import UserIcon from '../../assets/svgs/user.svg';
import BellIcon from '../../assets/svgs/bell.svg';
import CustomerSupportIcon from '../../assets/svgs/customer-support.svg';
import PaperIcon from '../../assets/svgs/paper.svg';
import LogoBlackIcon from '../../assets/svgs/logo-black.svg';
import Footer from '../../layouts/Footer';
import useUserStore from '../../stores/user';
import DeleteUser from '../../modals/DeleteUser';
import Alert from '../../components/Alert';
import { deleteAccount } from '../../api/sign-up';
import useLogin from '../../hooks/useLogin';

const Settings = () => {
  const router = useIonRouter();

  const { id } = useUserStore((state) => state.user);
  const { requestLogout } = useLogin();

  const buttonRef = useRef<HTMLButtonElement>(null);

  const [isLogin, setIsLogin] = useState(false);

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
        <Header type="close" />

        <div className="px-4">
          <IonText className="mt-1 font-headline1 text-gray8">환경 설정</IonText>

          <div className="mt-4">
            <MenuItem title="개인정보" icon={UserIcon} routeTo="/settings/informations" />
            <MenuItem title="알림" icon={BellIcon} routeTo="/settings/alert" />
            <MenuItem title="문의하기" icon={CustomerSupportIcon} routeTo="/settings/support" />
            <MenuItem title="법률" icon={PaperIcon} routeTo="/settings/policy" />
          </div>
        </div>

        <Footer>
          {isLogin ? (
            <button className="w-full mb-4 button-gray button-lg" onClick={requestLogout}>
              로그아웃
            </button>
          ) : (
            <Link to="/login">
              <button className="w-full mb-4 button-sub button-lg">로그인</button>
            </Link>
          )}

          <div className="flex items-center justify-center gap-2 mb-2">
            <IonIcon src={LogoBlackIcon} className="svg-md" />
            <p className="font-suite text-base font-extrabold leading-[1.625rem] -tracking-[0.0125rem]">
              PeopleHere
            </p>
          </div>

          <div className="flex flex-col items-center mb-2">
            <p className="font-caption2 text-gray5.5">버전 1.0</p>
            <p className="font-caption2 text-gray5.5">전 세계의 모든 우정을 담아.</p>
          </div>

          {isLogin ? (
            <p id="delete-modal" className="text-center underline font-caption1 text-gray5.5">
              계정 삭제
            </p>
          ) : (
            <Link to="/sign-up/email">
              <p className="text-center underline font-caption1 text-gray5.5">회원가입</p>
            </Link>
          )}
        </Footer>

        <DeleteUser trigger="delete-modal" onDidDismiss={() => buttonRef.current?.click()} />

        <button id="delete-confirm-alert" className="hidden" ref={buttonRef} />
        <Alert
          trigger="delete-confirm-alert"
          title="정말로 계정을 삭제할까요?"
          buttons={[
            {
              text: '계정 삭제',
              onClick: () =>
                deleteAccount(id).then(() => router.push('/login', 'forward', 'replace')),
            },
            {
              text: '취소',
            },
          ]}
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
