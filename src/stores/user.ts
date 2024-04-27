import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type State = {
  user: {
    id: string;
    profileImageUrl: string;
    firstName: string;
    lastName: string;
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
        profileImageUrl: '',
        firstName: '',
        lastName: '',
      },

      setUser: (user) => set(() => ({ user })),
    }),
    { name: 'user-storage' },
  ),
);

export default useUserStore;
