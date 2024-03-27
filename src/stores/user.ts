import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type State = {
  region: {
    '2digitCode': string;
    ISONumbericCode: number;
  };
};

type Action = {
  setRegion: (region: State['region']) => void;
};

const useRegionStore = create(
  persist<State & Action>(
    (set) => ({
      region: {
        '2digitCode': '',
        ISONumbericCode: 0,
      },

      setRegion: (region: State['region']) => set(() => ({ region })),
    }),
    { name: 'region-storage' },
  ),
);

export default useRegionStore;
