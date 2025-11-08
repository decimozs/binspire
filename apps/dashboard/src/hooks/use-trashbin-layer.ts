import { useMemo, useCallback } from "react";
import { ScenegraphLayer } from "@deck.gl/mesh-layers";
import { type Trashbin } from "@binspire/query";
import { useTrashbinMap } from "./use-trashbin-map";
import { TRASHBIN_CONFIG } from "@binspire/shared";

type TrashbinWithLevel = Trashbin & {
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
    getOrientation: () => [0, 10 * 180, 90],
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
  const { setViewFromMap } = useTrashbinMap();
  const handleClick = useCallback(
    (bin: TrashbinWithLevel) => {
      setViewFromMap({
        type: "trashbin",
        id: bin.id,
      });
    },
    [setViewFromMap],
  );

  return useMemo(() => {
    if (!trashbinsWithLevel.length) return [];

    const wasteConfig = TRASHBIN_CONFIG["waste-level"];

    return [
      createTrashbinLayer(
        "trashbin-empty",
        trashbinsWithLevel.filter((b) => b.wasteLevel <= wasteConfig.low.value),
        "/models/bin.glb",
        handleClick,
      ),
      createTrashbinLayer(
        "trashbin-low",
        trashbinsWithLevel.filter(
          (b) =>
            b.wasteLevel > wasteConfig.low.value &&
            b.wasteLevel < wasteConfig["almost-full"].value,
        ),
        "/models/bin.glb",
        handleClick,
      ),
      createTrashbinLayer(
        "trashbin-almost-full",
        trashbinsWithLevel.filter(
          (b) =>
            b.wasteLevel >= wasteConfig["almost-full"].value &&
            b.wasteLevel < wasteConfig.full.value,
        ),
        "/models/almost-full.glb",
        handleClick,
      ),
      createTrashbinLayer(
        "trashbin-full",
        trashbinsWithLevel.filter(
          (b) =>
            b.wasteLevel >= wasteConfig.full.value &&
            b.wasteLevel < wasteConfig.overflowing.value,
        ),
        "/models/full.glb",
        handleClick,
      ),
      createTrashbinLayer(
        "trashbin-overflowing",
        trashbinsWithLevel.filter(
          (b) => b.wasteLevel >= wasteConfig.overflowing.value,
        ),
        "/models/overflowing.glb",
        handleClick,
      ),
    ];
  }, [trashbinsWithLevel, handleClick]);
}
