import { useMemo, useCallback, useEffect, useState } from "react";
import { ScenegraphLayer } from "@deck.gl/mesh-layers";
import { ScatterplotLayer } from "@deck.gl/layers";
import { type Trashbin } from "@binspire/query";
import { useQueryState } from "nuqs";
import { useMap } from "react-map-gl/maplibre";
import { TRASHBIN_CONFIG } from "@binspire/shared";

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
  const { current: map } = useMap();
  const [, setTrashbinQuery] = useQueryState("trashbin_id");
  const [, setLatQuery] = useQueryState("lat");
  const [, setLngQuery] = useQueryState("lng");
  const [pingScale, setPingScale] = useState(0);

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

  useEffect(() => {
    let frameId: number;
    let start = performance.now();

    const animate = (time: number) => {
      const t = ((time - start) / 1000) % 1;
      setPingScale(t);
      frameId = requestAnimationFrame(animate);
    };

    frameId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frameId);
  }, []);

  return useMemo(() => {
    if (!trashbinsWithLevel.length) return [];

    const wasteConfig = TRASHBIN_CONFIG["waste-level"];
    const overflowingBins = trashbinsWithLevel.filter(
      (b) => b.wasteLevel >= wasteConfig.overflowing.value,
    );
    const almostFullBins = trashbinsWithLevel.filter(
      (b) =>
        b.wasteLevel >= wasteConfig["almost-full"].value &&
        b.wasteLevel < wasteConfig.full.value,
    );
    const fullBins = trashbinsWithLevel.filter(
      (b) =>
        b.wasteLevel >= wasteConfig.full.value &&
        b.wasteLevel < wasteConfig.overflowing.value,
    );

    return [
      new ScatterplotLayer({
        id: "overflow-highlight",
        data: overflowingBins,
        getPosition: (d) => [d.longitude, d.latitude],
        getFillColor: () => [255, 0, 0, Math.round(180 * (1 - pingScale))],
        getRadius: () => 25 + pingScale * 40,
        radiusMinPixels: 10,
        radiusMaxPixels: 50,
        stroked: true,
        getLineColor: [255, 0, 0, 180],
        lineWidthMinPixels: 1,
        pickable: false,
        parameters: { depthTest: false },
      }),

      new ScatterplotLayer({
        id: "almost-full-highlight",
        data: almostFullBins,
        getPosition: (d) => [d.longitude, d.latitude],
        getFillColor: [255, 255, 0, 50],
        getRadius: 10,
        radiusMinPixels: 10,
        radiusMaxPixels: 30,
        stroked: false,
        pickable: false,
        parameters: { depthTest: false },
      }),

      new ScatterplotLayer({
        id: "full-highlight",
        data: fullBins,
        getPosition: (d) => [d.longitude, d.latitude],
        getFillColor: [255, 165, 0, 50],
        getRadius: 20,
        radiusMinPixels: 10,
        radiusMaxPixels: 30,
        stroked: false,
        pickable: false,
        parameters: { depthTest: false },
      }),

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
        almostFullBins,
        "/models/almost-full.glb",
        handleClick,
      ),
      createTrashbinLayer(
        "trashbin-full",
        fullBins,
        "/models/full.glb",
        handleClick,
      ),
      createTrashbinLayer(
        "trashbin-overflowing",
        overflowingBins,
        "/models/overflowing.glb",
        handleClick,
      ),
    ];
  }, [trashbinsWithLevel, handleClick, pingScale]);
}
