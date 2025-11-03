import { createContext } from "react";

export type MapLayer = "dark" | "light";

export interface MapLayerProviderState {
  layer: MapLayer;
  setLayer: (layer: MapLayer) => void;
  mapStyle: string;
  settingsMapStyle: string;
}

export interface MapLayerProviderProps {
  children: React.ReactNode;
  defaultLayer?: MapLayer;
  storageKey?: string;
}

export const MapLayerContext = createContext<MapLayerProviderState>({
  layer: "dark",
  setLayer: () => null,
  mapStyle: "",
  settingsMapStyle: "",
});
