import { create } from "zustand";
import type { ViewState } from "react-map-gl/maplibre";

interface MapState {
  viewState: Partial<ViewState>;
  setViewState: (viewState: Partial<ViewState>) => void;
  updateViewState: (updates: Partial<ViewState>) => void;
  resetViewState: (defaultView: Partial<ViewState>) => void;
}

export const useMapStore = create<MapState>((set) => ({
  viewState: {
    longitude: -122.4,
    latitude: 37.8,
    zoom: 16.5,
    pitch: 70,
    bearing: 10,
  },
  setViewState: (viewState) => set({ viewState }),
  updateViewState: (updates) =>
    set((state) => ({
      viewState: { ...state.viewState, ...updates },
    })),
  resetViewState: (defaultView) => set({ viewState: defaultView }),
}));
