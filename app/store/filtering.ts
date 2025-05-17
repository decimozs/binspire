import { create } from "zustand";

interface FilteringStore {
  isFiltering: boolean;
  setFiltering: (value: boolean) => void;
}

export const useFilteringStore = create<FilteringStore>((set) => ({
  isFiltering: false,
  setFiltering: (value) => set({ isFiltering: value }),
}));
