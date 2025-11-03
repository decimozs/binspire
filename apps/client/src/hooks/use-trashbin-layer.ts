import { useMemo, useCallback } from "react";
import { ScenegraphLayer } from "@deck.gl/mesh-layers";
import { type Trashbin } from "@binspire/query";
import { useQueryState } from "nuqs";
import { useMap } from "react-map-gl/maplibre";

export type TrashbinWithLevel = Trashbin & {
  wasteLevel: number;
  weightLevel: number;
  batteryLevel: number;
};

function createTrashbinLayer(
  id: string,
  data: TrashbinWithLevel[],
  modelPath: string,
  onClick: (bin: TrashbinWithLevel) => void,
) {
  return new ScenegraphLayer<TrashbinWithLevel>({
    id,
    data,
    getPosition: (d) =>
      d.latitude && d.longitude ? [d.longitude, d.latitude] : [0, 0],
    getOrientation: () => [0, Math.random() * 180, 90],
    scenegraph: modelPath,
    sizeScale: 1,
    getScale: [0.1, 0.1, 0.1],
    _animations: { "*": { speed: 5 } },
    _lighting: "pbr",
    pickable: true,
    onClick: (info) => {
      if (info.object) {
        onClick(info.object);
      }
    },
    updateTriggers: {
      getPosition: data.map((d) => [d.longitude, d.latitude]),
    },
  });
}

export function useTrashbinLayer(trashbinsWithLevel: TrashbinWithLevel[]) {
  const { current: map } = useMap();
  const [, setTrashbinQuery] = useQueryState("trashbin_id");
  const [, setLatQuery] = useQueryState("lat");
  const [, setLngQuery] = useQueryState("lng");

  const handleClick = useCallback((bin: TrashbinWithLevel) => {
    if (!map) return null;

    setTrashbinQuery(bin.id);
    setLatQuery(bin.latitude!.toString());
    setLngQuery(bin.longitude!.toString());

    map.flyTo({
      center: [bin.longitude!, bin.latitude!],
      zoom: 19,
      padding: { bottom: 350 },
      pitch: 70,
      bearing: 10,
      essential: true,
    });
  }, []);

  return useMemo(() => {
    if (!trashbinsWithLevel.length) return [];

    return [
      createTrashbinLayer(
        "trashbin-empty",
        trashbinsWithLevel.filter((b) => b.wasteLevel <= 30),
        "/models/bin.glb",
        handleClick,
      ),
      createTrashbinLayer(
        "trashbin-almost-full",
        trashbinsWithLevel.filter(
          (b) => b.wasteLevel > 30 && b.wasteLevel < 90,
        ),
        "/models/almost-full.glb",
        handleClick,
      ),
      createTrashbinLayer(
        "trashbin-full",
        trashbinsWithLevel.filter(
          (b) => b.wasteLevel >= 90 && b.wasteLevel < 100,
        ),
        "/models/full.glb",
        handleClick,
      ),
      createTrashbinLayer(
        "trashbin-overflowing",
        trashbinsWithLevel.filter((b) => b.wasteLevel >= 100),
        "/models/overflowing.glb",
        handleClick,
      ),
    ];
  }, [trashbinsWithLevel, handleClick]);
}
