import { create } from 'zustand';

type State = {
  region: string;
};

type Action = {
  setRegion: (region: State['region']) => void;
};

const useRegionStore = create<State & Action>((set) => ({
  region: '',
  setRegion: (region: string) => set(() => ({ region })),
}));

export default useRegionStore;
