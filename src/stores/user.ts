import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type State = {
  user: {
    id: string;
    email: string;
    profileImageUrl: string;
    firstName: string;
    lastName: string;
    phoneNumber: string;
  };
};

type Action = {
  setUser: (user: State['user']) => void;
};

const useUserStore = create(
  persist<State & Action>(
    (set) => ({
      user: {
        id: '0',
        email: '',
        profileImageUrl: '',
        firstName: '',
        lastName: '',
        phoneNumber: '',
      },

      setUser: (user) => set(() => ({ user })),
    }),
    { name: 'user-storage' },
  ),
);

export default useUserStore;
