import { create } from 'zustand';

const useStore = create((set) => ({
  region: 'KR',
  setRegion: (region: string) => set({ region }),
}));

export default useStore;
