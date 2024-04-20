import type { StoreApi } from 'zustand';

export type StoreSlice<T> = (set: StoreApi<T>['setState'], get: StoreApi<T>['getState']) => T;
