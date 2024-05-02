import { Preferences } from '@capacitor/preferences';
import { useIonRouter } from '@ionic/react';

import { signIn } from '../api/login';
import useUserStore from '../stores/user';

const useLogin = () => {
  const router = useIonRouter();
  const { user, setUser } = useUserStore((state) => state);

  const requestLogin = async (email: string, password: string) => {
    const response = await signIn({ email, password });

    if (response.status === 200) {
      await Preferences.set({ key: 'accessToken', value: response.data.accessToken });
      await Preferences.set({ key: 'refreshToken', value: response.data.refreshToken });

      setUser({
        id: response.data.id,
        profileImageUrl: '',
        firstName: '',
        lastName: '',
      });

      return;
    }

    throw new Error('Login failed');
  };

  const requestLogout = async () => {
    await Preferences.remove({ key: 'accessToken' });
    await Preferences.remove({ key: 'refreshToken' });

    setUser({ id: '0', profileImageUrl: '', firstName: '', lastName: '' });

    router.push('/login', 'forward', 'replace');
  };

  const checkLogin = async () => {
    const { value } = await Preferences.get({ key: 'accessToken' });

    if (user.id === '0' || !value || value === 'undefined') {
      router.push('/login', 'forward', 'replace');
      return false;
    }

    return true;
  };

  return { requestLogin, requestLogout, checkLogin };
};

export default useLogin;
