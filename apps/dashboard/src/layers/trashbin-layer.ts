import { ScenegraphLayer } from "@deck.gl/mesh-layers";

const trashbins = [
  { name: "Trashbin 1", coordinates: [121.076093, 14.577526], wasteLevel: 0 },
  { name: "Trashbin 2", coordinates: [121.075782, 14.577887], wasteLevel: 30 },
  { name: "Trashbin 3", coordinates: [121.076554, 14.577254], wasteLevel: 70 },
  { name: "Trashbin 4", coordinates: [121.074581, 14.578657], wasteLevel: 90 },
  { name: "Trashbin 5", coordinates: [121.076222, 14.576658], wasteLevel: 100 },
];

function createTrashbinLayer(
  id: string,
  data: typeof trashbins,
  modelPath: string,
) {
  return new ScenegraphLayer({
    id,
    data,
    getPosition: (d) => d.coordinates,
    getOrientation: () => [0, Math.random() * 180, 90],
    scenegraph: modelPath,
    sizeScale: 1,
    getScale: [0.1, 0.1, 0.1],
    _animations: { "*": { speed: 5 } },
    _lighting: "pbr",
    pickable: true,
    onClick: (info) => {
      if (info.object) {
        alert(`You clicked on ${info.object.name}`);
      }
    },
  });
}

const trashbinLayers = [
  createTrashbinLayer(
    "trashbin-empty",
    trashbins.filter((b) => b.wasteLevel === 0 || b.wasteLevel <= 30),
    "/models/bin.glb",
  ),
  createTrashbinLayer(
    "trashbin-almost-full",
    trashbins.filter((b) => b.wasteLevel > 30 && b.wasteLevel < 90),
    "/models/almost-full.glb",
  ),
  createTrashbinLayer(
    "trashbin-full",
    trashbins.filter((b) => b.wasteLevel >= 90 && b.wasteLevel < 100),
    "/models/full.glb",
  ),
  createTrashbinLayer(
    "trashbin-overflowing",
    trashbins.filter((b) => b.wasteLevel >= 100),
    "/models/overflowing.glb",
  ),
];

export default trashbinLayers;
