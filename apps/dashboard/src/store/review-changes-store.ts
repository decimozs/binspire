import { create } from "zustand";

/* eslint-disable @typescript-eslint/no-explicit-any */
export interface ReviewChangesState<T = any> {
  prevValue: T | null;
  newValue: T | null;
  setPrevValue: (value: T) => void;
  setNewValue: (value: T) => void;
  reset: () => void;
}

export const useReviewChangesStore = create<ReviewChangesState>((set) => ({
  prevValue: null,
  newValue: null,
  setPrevValue: (value) => set({ prevValue: value }),
  setNewValue: (value) => set({ newValue: value }),
  reset: () => set({ prevValue: null, newValue: null }),
}));
