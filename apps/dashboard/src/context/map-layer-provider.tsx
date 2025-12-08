import { type ReactNode, useEffect, useState } from "react";
import {
  darkStyle,
  lightStyle,
  settingsDarkStyle,
  settingsLightStyle,
} from "@/features/settings/lib/constants";
import { type MapLayer, MapLayerContext } from "./map-layer-context";

interface Props {
  children: ReactNode;
  defaultLayer?: MapLayer;
  storageKey?: string;
}

export function MapLayerProvider({
  children,
  defaultLayer = "dark",
  storageKey = "map-layer",
}: Props) {
  const [layer, setLayerState] = useState<MapLayer>(
    () => (localStorage.getItem(storageKey) as MapLayer) || defaultLayer,
  );

  const mapStyle =
    layer === "dark"
      ? `https://api.maptiler.com/maps/${darkStyle}/style.json?key=${import.meta.env.VITE_MAP_TILER_KEY}`
      : `https://api.maptiler.com/maps/${lightStyle}/style.json?key=${import.meta.env.VITE_MAP_TILER_KEY}`;

  const settingsMapStyle =
    layer === "dark"
      ? `https://api.maptiler.com/maps/${settingsDarkStyle}/style.json?key=${import.meta.env.VITE_MAP_TILER_KEY}`
      : `https://api.maptiler.com/maps/${settingsLightStyle}/style.json?key=${import.meta.env.VITE_MAP_TILER_KEY}`;

  useEffect(() => {
    localStorage.setItem(storageKey, layer);
  }, [layer, storageKey]);

  const value = {
    layer,
    setLayer: (newLayer: MapLayer) => {
      localStorage.setItem(storageKey, newLayer);
      setLayerState(newLayer);
    },
    mapStyle,
    settingsMapStyle,
  };

  return (
    <MapLayerContext.Provider value={value}>
      {children}
    </MapLayerContext.Provider>
  );
}
