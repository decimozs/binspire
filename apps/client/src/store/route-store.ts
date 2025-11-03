import { create } from "zustand";

interface ORSMetadata {
  attribution?: string;
  engine?: {
    build_date?: string;
    version?: string;
    osm_date?: string;
  };
  query?: {
    profile?: string;
    coordinates?: [number, number][];
  };
}

interface ORSFeatureCollection extends GeoJSON.FeatureCollection {
  metadata?: ORSMetadata;
}

interface RouteState {
  route: ORSFeatureCollection | null;
  setRoute: (route: ORSFeatureCollection | null) => void;
  deleteRoute: () => void;
}

export const useRouteStore = create<RouteState>((set) => ({
  route: null,
  setRoute: (route) => set({ route }),
  deleteRoute: () => set({ route: null }),
}));
