import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type Gender = 'MALE' | 'FEMALE' | 'OTHER';

type State = {
  email: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  password: string;
  birthDate: string;
  gender: Gender;
  policyConsent: {
    privacy: boolean;
    marketing: boolean;
  };
  region: {
    countryCode: string;
    englishName: string;
    koreanName: string;
    dialCode: number;
  };
};

type Action = {
  setEmail: (email: string) => void;
  setPhoneNumber: (phoneNumber: string) => void;
  setPassword: (password: string) => void;
  setUserInfo: (info: Omit<State, 'email' | 'phoneNumber'>) => void;
  setPolicyConsent: (consent: State['policyConsent']) => void;
  setFirstName: (firstName: string) => void;
  setLastName: (lastName: string) => void;
  setBirthDate: (birthDate: string) => void;
  setGender: (gender: Gender) => void;
  setRegion: (region: State['region']) => void;
  resetRegion: () => void;

  clearSignInInfo: () => void;
};

const useSignInStore = create(
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
        countryCode: '',
        dialCode: 0,
        koreanName: '',
        englishName: '',
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
      setFirstName: (firstName: string) => set(() => ({ firstName })),
      setLastName: (lastName: string) => set(() => ({ lastName })),
      setBirthDate: (birthDate: string) => set(() => ({ birthDate })),
      setGender: (gender: Gender) => set(() => ({ gender })),
      setRegion: (region: State['region']) => set(() => ({ region })),
      resetRegion: () =>
        set(() => ({
          region: { countryCode: '', dialCode: 0, koreanName: '', englishName: '' },
        })),

      clearSignInInfo: () =>
        set(() => ({
          email: '',
          phoneNumber: '',
          password: '',
          firstName: '',
          lastName: '',
          birthDate: '',
          gender: 'OTHER',
          region: { countryCode: '', dialCode: 0, koreanName: '', englishName: '' },
          policyConsent: { privacy: false, marketing: false },
        })),
    }),
    { name: 'signin-storage' },
  ),
);

export default useSignInStore;
