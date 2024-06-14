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
  fetchImages: boolean;
  theme: string;
};

type Action = {
  setPlace: (place: State['place']) => void;
  setTitle: (title: string) => void;
  setDescription: (description: string) => void;
  setImages: (images: string[]) => void;
  setFetchImages: (fetchImages: boolean) => void;
  setTheme: (theme: string) => void;
  clearAll: () => void;
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
  fetchImages: true,
  theme: 'black',

  setPlace: (place) => set(() => ({ place })),
  setTitle: (title) => set(() => ({ title })),
  setDescription: (description) => set(() => ({ description })),
  setImages: (images) => set(() => ({ images })),
  setFetchImages: (fetchImages) => set(() => ({ fetchImages })),
  setTheme: (theme) => set(() => ({ theme })),
  clearAll: () =>
    set(() => ({
      place: {
        id: '',
        title: '',
        address: '',
      },
      title: '',
      description: '',
      images: [],
      fetchImages: true,
      theme: 'black',
    })),
}));

export default usePostPlaceStore;
