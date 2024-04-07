import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type State = {
  email: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  birthDate: string;
  gender: 'MALE' | 'FEMALE' | 'OTHER';
};

type Action = {
  setEmail: (email: string) => void;
  setPhoneNumber: (phoneNumber: string) => void;
  setUserInfo: (info: Omit<State, 'email' | 'phoneNumber'>) => void;
};

const useUserStore = create(
  persist<State & Action>(
    (set) => ({
      email: '',
      firstName: '',
      lastName: '',
      phoneNumber: '',
      birthDate: '',
      gender: 'OTHER',

      setEmail: (email: string) => set(() => ({ email })),
      setPhoneNumber: (phoneNumber: string) => set(() => ({ phoneNumber })),
      setUserInfo: (info: Omit<State, 'email' | 'phoneNumber'>) => set(() => ({ ...info })),
    }),
    { name: 'user-storage' },
  ),
);

export default useUserStore;
