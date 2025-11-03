import { create } from "zustand";
import { persist } from "zustand/middleware";

type Layout = "full" | "compact";

interface LayoutState {
  layout: Layout;
  setLayout: (layout: Layout) => void;
}

export const useLayout = create<LayoutState>()(
  persist(
    (set) => ({
      layout: "compact",
      setLayout: (layout) => set({ layout }),
    }),
    {
      name: "layout",
    },
  ),
);
