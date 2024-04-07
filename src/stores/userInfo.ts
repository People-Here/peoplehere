import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type State = {
  email: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  password: string;
  birthDate: string;
  gender: 'MALE' | 'FEMALE' | 'OTHER';
  policyConsent: {
    privacy: boolean;
    marketing: boolean;
  };
  region: {
    '2digitCode': string;
    ISONumbericCode: number;
    CountryNameKR: string;
    CountryNameEN: string;
  };
};

type Action = {
  setEmail: (email: string) => void;
  setPhoneNumber: (phoneNumber: string) => void;
  setPassword: (password: string) => void;
  setUserInfo: (info: Omit<State, 'email' | 'phoneNumber'>) => void;
  setPolicyConsent: (consent: State['policyConsent']) => void;
  setRegion: (region: State['region']) => void;
  resetRegion: () => void;
};

const useUserStore = create(
  persist<State & Action>(
    (set) => ({
      email: '',
      firstName: '',
      lastName: '',
      phoneNumber: '',
      password: '',
      birthDate: '',
      gender: 'OTHER',
      region: {
        '2digitCode': '',
        ISONumbericCode: 0,
        CountryNameKR: '',
        CountryNameEN: '',
      },
      policyConsent: {
        privacy: false,
        marketing: false,
      },

      setEmail: (email: string) => set(() => ({ email })),
      setPhoneNumber: (phoneNumber: string) => set(() => ({ phoneNumber })),
      setPassword: (password: string) => set(() => ({ password })),
      setUserInfo: (info: Omit<State, 'email' | 'phoneNumber' | 'password'>) =>
        set((prev) => ({ ...prev, ...info })),
      setPolicyConsent: (consent: State['policyConsent']) =>
        set(() => ({ policyConsent: consent })),
      setRegion: (region: State['region']) => set(() => ({ region })),
      resetRegion: () =>
        set(() => ({
          region: { '2digitCode': '', ISONumbericCode: 0, CountryNameKR: '', CountryNameEN: '' },
        })),
    }),
    { name: 'user-storage' },
  ),
);

export default useUserStore;
