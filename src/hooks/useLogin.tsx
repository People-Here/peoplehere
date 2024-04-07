import { signIn } from '../api/login';
import useStorage from './useStorage';

const useLogin = () => {
  const { setItem, removeItem } = useStorage();

  const requestLogin = async (email: string, password: string) => {
    const response = await signIn({ email, password });

    if (response.status === 200) {
      await setItem('accessToken', response.data.data.accessToken);
      await setItem('refreshToken', response.data.data.refreshToken);
      return;
    }

    throw new Error('Login failed');
  };

  const requestLogout = async () => {
    await removeItem('accessToken');
    await removeItem('refreshToken');
  };

  return { requestLogin, requestLogout };
};

export default useLogin;
