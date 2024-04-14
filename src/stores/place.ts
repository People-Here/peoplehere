import { create } from 'zustand';

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

const usePlaceStore = create<State & Action>((set) => ({
  place: {
    id: '',
    text: '',
    description: '',
  },

  setPlace: (place) => set(() => ({ place })),
}));

export default usePlaceStore;
