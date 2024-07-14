import { create } from 'zustand';

type State = {
  place: {
    id: string;
    title: string;
    address: string;
    latitude?: number;
    longitude?: number;
  };
  title: string;
  description: string;
  images: {
    authorName?: string;
    authorUrl?: string;
    imageUrl: string;
  }[];
  fetchImages: boolean;
  theme: string;
  isDefaultImage: boolean;
};

type Action = {
  setPlace: (place: State['place']) => void;
  setTitle: (title: string) => void;
  setDescription: (description: string) => void;
  setImages: (
    images: {
      authorName?: string;
      authorUrl?: string;
      imageUrl: string;
    }[],
  ) => void;
  setFetchImages: (fetchImages: boolean) => void;
  setTheme: (theme: string) => void;
  setIsDefaultImage: (isDefaultImage: boolean) => void;
  clearAll: () => void;
};

const usePostPlaceStore = create<State & Action>((set) => ({
  place: {
    id: '',
    title: '',
    address: '',
    latitude: 0,
    longitude: 0,
  },
  title: '',
  description: '',
  images: [],
  fetchImages: true,
  theme: 'black',
  isDefaultImage: false,

  setPlace: (place) => set(() => ({ place })),
  setTitle: (title) => set(() => ({ title })),
  setDescription: (description) => set(() => ({ description })),
  setImages: (images) => set(() => ({ images })),
  setFetchImages: (fetchImages) => set(() => ({ fetchImages })),
  setTheme: (theme) => set(() => ({ theme })),
  setIsDefaultImage: (isDefaultImage) => set(() => ({ isDefaultImage })),
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
      isDefaultImage: false,
    })),
}));

export default usePostPlaceStore;
