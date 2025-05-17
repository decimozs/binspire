import type { FeatureCollection } from "geojson";
import { create } from "zustand";

interface DirectionState {
  routeDirections: FeatureCollection | null;
  setRouteDirections: (directions: FeatureCollection | null) => void;
}

export const useDirectionStore = create<DirectionState>((set) => ({
  routeDirections: null,
  setRouteDirections: (routeDirections) => set({ routeDirections }),
}));
