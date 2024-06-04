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
};

type Action = {
  setPlace: (place: State['place']) => void;
  setTitle: (title: string) => void;
  setDescription: (description: string) => void;
  setImages: (images: string[]) => void;
  setFetchImages: (fetchImages: boolean) => void;
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

  setPlace: (place) => set(() => ({ place })),
  setTitle: (title) => set(() => ({ title })),
  setDescription: (description) => set(() => ({ description })),
  setImages: (images) => set(() => ({ images })),
  setFetchImages: (fetchImages) => set(() => ({ fetchImages })),
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
    })),
}));

export default usePostPlaceStore;
