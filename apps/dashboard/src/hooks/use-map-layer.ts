import { useContext } from "react";
import { MapLayerContext } from "@/context/map-layer-context";

export const useMapLayer = () => {
  const context = useContext(MapLayerContext);

  if (!context)
    throw new Error("useMapLayer must be used within a MapLayerProvider");

  return context;
};
