import { create } from "zustand";

interface MapLayerStore {
  layer: string;
  layerImage: string;
  setLayer: (layer: string) => void;
  setLayerImage: (image: string) => void;
}

export const useMapLayerStore = create<MapLayerStore>((set) => ({
  layer: "0196585a-8568-78da-9d4f-9e0a23f2efd9",
  layerImage: "/map-layers/streets-layer.png",
  setLayer: (layer) => set({ layer: layer }),
  setLayerImage: (image) => set({ layerImage: image }),
}));
