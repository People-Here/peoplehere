import type { StoreSlice } from '../types/store';
import type { Language } from '../types/language';

type State = {
  introduce: string;
  languages: Language[];
  showAge: boolean;
  school: string;
  job: string;
  location: string;
  hobby: string;
  favorite: string;
  pet: string;
};

type Action = {
  setIntroduce: (introduce: string) => void;
  setLanguages: (languages: Language[]) => void;
  setShowAge: (show: boolean) => void;
  setSchool: (school: string) => void;
  setJob: (job: string) => void;
  setLocation: (location: string) => void;
  setHobby: (hobby: string) => void;
  setFavorite: (favorite: string) => void;
  setPet: (pet: string) => void;
};

export type ProfileSlice = State & Action;

const createProfileSlice: StoreSlice<ProfileSlice> = (set) => ({
  introduce: '',
  languages: [],
  showAge: false,
  school: '',
  job: '',
  location: '',
  hobby: '',
  favorite: '',
  pet: '',

  setIntroduce: (introduce) => set(() => ({ introduce })),
  setLanguages: (languages) => set(() => ({ languages })),
  setShowAge: (show) => set(() => ({ showAge: show })),
  setSchool: (school) => set(() => ({ school })),
  setJob: (job) => set(() => ({ job })),
  setLocation: (location) => set(() => ({ location })),
  setHobby: (hobby) => set(() => ({ hobby })),
  setFavorite: (favorite) => set(() => ({ favorite })),
  setPet: (pet) => set(() => ({ pet })),
});

export default createProfileSlice;
