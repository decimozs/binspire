import { create } from "zustand";

interface NavigateStore {
  trashbinId: string | null;
  startLatLang: string | null;
  endLatLang: string | null;
  routeDirection: string | null;
  setTrashbinId: (id: string | null) => void;
  setStartLatLang: (latlang: string) => void;
  setEndLatLang: (latlang: string) => void;
  setRouteDirection: (value: string) => void;
  reset: () => void;
}

export const useNavigateStore = create<NavigateStore>((set) => ({
  trashbinId: null,
  startLatLang: null,
  endLatLang: null,
  routeDirection: null,
  setTrashbinId: (id: string | null) => set({ trashbinId: id }),
  setStartLatLang: (latlang: string) => set({ startLatLang: latlang }),
  setEndLatLang: (latlang: string) => set({ endLatLang: latlang }),
  setRouteDirection: (value: string) => set({ routeDirection: value }),
  reset: () =>
    set({
      startLatLang: null,
      endLatLang: null,
      routeDirection: null,
    }),
}));
