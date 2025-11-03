import { MapLayerContext } from "@/context/map-layer-context";
import { useContext } from "react";

export const useMapLayer = () => {
  const context = useContext(MapLayerContext);

  if (!context)
    throw new Error("useMapLayer must be used within a MapLayerProvider");

  return context;
};
