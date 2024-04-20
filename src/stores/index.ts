import { create } from 'zustand';

import createProfileSlice from './profile';
import createPlaceSlice from './place';

import type { PlaceSlice } from './place';
import type { ProfileSlice } from './profile';

type StoreState = ProfileSlice & PlaceSlice;

export const useAppStore = create<StoreState>((set, get) => ({
  ...createProfileSlice(set, get),
  ...createPlaceSlice(set, get),
}));
