import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type State = {
  region: {
    '2digitCode': string;
    ISONumbericCode: number;
    CountryNameKR: string;
    CountryNameEN: string;
  };
};

type Action = {
  setRegion: (region: State['region']) => void;
  resetRegion: () => void;
};

const useRegionStore = create(
  persist<State & Action>(
    (set) => ({
      region: {
        '2digitCode': '',
        ISONumbericCode: 0,
        CountryNameKR: '',
        CountryNameEN: '',
      },

      setRegion: (region: State['region']) => set(() => ({ region })),
      resetRegion: () =>
        set(() => ({
          region: { '2digitCode': '', ISONumbericCode: 0, CountryNameKR: '', CountryNameEN: '' },
        })),
    }),
    { name: 'region-storage' },
  ),
);

export default useRegionStore;
