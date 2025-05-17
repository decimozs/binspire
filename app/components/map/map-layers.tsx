import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { mapLayerItems } from "@/lib/constants";
import { useMapLayerStore } from "@/store/map-layers.store";
import { Layers } from "lucide-react";

export default function MapLayers() {
  const { setLayer, setLayerImage, layerImage } = useMapLayerStore();

  const handleSetMapLayer = (layer: string, layerImage: string) => {
    setLayer(layer);
    setLayerImage(layerImage);
    sessionStorage.setItem("mapLayer", JSON.stringify({ layer, layerImage }));
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="fixed bottom-8 ml-4 cursor-pointer">
        <div className="w-[90px] h-[90px] rounded-md border-[1px] border-input">
          <img src={layerImage} alt="layer-image" className="rounded-md" />
          <div className="absolute left-0 bottom-0 p-1 flex flex-row items-center gap-2 bg-black/40 text-white backdrop-blur-sm w-[90px] rounded-bl-sm rounded-br-sm">
            <Layers size={15} className="ml-2" />
            <p>Layers</p>
          </div>
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        side="right"
        className="ml-4 flex flex-row gap-2 h-[90px] p-2"
      >
        {mapLayerItems.map((item) => (
          <div
            className="w-[55px] h-[40px] rounded-md border-[1px] border-input cursor-pointer"
            onClick={() => handleSetMapLayer(item.layer, item.layerImage)}
            key={item.name}
          >
            <img
              src={item.layerImage}
              alt="layer-image"
              className="rounded-md"
            />
            <p className="text-sm text-muted-foreground text-center">
              {item.name}
            </p>
          </div>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
