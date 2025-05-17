import { create } from "zustand";

type ActionStore = {
  actionMade: number;
  incrementActionMade: () => void;
  resetActionMade: () => void;
};

export const useActionStore = create<ActionStore>((set) => ({
  actionMade: 0,
  incrementActionMade: () =>
    set((state) => ({ actionMade: state.actionMade + 1 })),
  resetActionMade: () => set({ actionMade: 0 }),
}));
