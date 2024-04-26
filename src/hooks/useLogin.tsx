import { Preferences } from '@capacitor/preferences';

import { signIn } from '../api/login';

const useLogin = () => {
  const requestLogin = async (email: string, password: string) => {
    const response = await signIn({ email, password });

    if (response.status === 200) {
      await Preferences.set({ key: 'accessToken', value: response.data.accessToken });
      await Preferences.set({ key: 'refreshToken', value: response.data.refreshToken });
      return;
    }

    throw new Error('Login failed');
  };

  const requestLogout = async () => {
    await Preferences.remove({ key: 'accessToken' });
    await Preferences.remove({ key: 'refreshToken' });
  };

  return { requestLogin, requestLogout };
};

export default useLogin;
