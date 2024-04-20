import type { StoreSlice } from '../types/store';

type State = {
  place: {
    id: string;
    text: string;
    description: string;
  };
};

type Action = {
  setPlace: (place: State['place']) => void;
};

export type PlaceSlice = State & Action;

const createPlaceSlice: StoreSlice<PlaceSlice> = (set) => ({
  place: {
    id: '',
    text: '',
    description: '',
  },

  setPlace: (place) => set(() => ({ place })),
});

export default createPlaceSlice;
