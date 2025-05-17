import { create } from "zustand";

type ActiveUsersStore = {
  activeAdmins: number;
  activeCollectors: number;
  incrementActiveAdmins: () => void;
  decrementActiveAdmins: () => void;
  incrementActiveCollectors: () => void;
  decrementActiveCollectors: () => void;
  resetActiveUsers: () => void;
  setActiveAdmins: (count: number) => void;
  setActiveCollectors: (count: number) => void;
};

export const useActiveUsersStore = create<ActiveUsersStore>((set) => ({
  activeAdmins: 0,
  activeCollectors: 0,
  incrementActiveAdmins: () =>
    set((state) => ({ activeAdmins: state.activeAdmins + 1 })),
  decrementActiveAdmins: () =>
    set((state) => ({
      activeAdmins: Math.max(0, state.activeAdmins - 1),
    })),
  incrementActiveCollectors: () =>
    set((state) => ({
      activeCollectors: state.activeCollectors + 1,
    })),
  decrementActiveCollectors: () =>
    set((state) => ({
      activeCollectors: Math.max(0, state.activeCollectors - 1),
    })),
  resetActiveUsers: () => set({ activeAdmins: 0, activeCollectors: 0 }),
  setActiveAdmins: (count: number) => set({ activeAdmins: count }),
  setActiveCollectors: (count: number) => set({ activeCollectors: count }),
}));
