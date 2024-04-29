import { create } from 'zustand';

type State = {
  place: {
    id: string;
    title: string;
    address: string;
  };
  title: string;
  description: string;
  images: string[];
};

type Action = {
  setPlace: (place: State['place']) => void;
  setTitle: (title: string) => void;
  setDescription: (description: string) => void;
  setImages: (images: string[]) => void;
};

const usePostPlaceStore = create<State & Action>((set) => ({
  place: {
    id: '',
    title: '',
    address: '',
  },
  title: '',
  description: '',
  images: [],

  setPlace: (place) => set(() => ({ place })),
  setTitle: (title) => set(() => ({ title })),
  setDescription: (description) => set(() => ({ description })),
  setImages: (images) => set(() => ({ images })),
}));

export default usePostPlaceStore;
