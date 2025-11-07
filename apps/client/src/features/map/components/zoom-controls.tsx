import { Button } from "@binspire/ui/components/button";
import { Minus, Plus } from "lucide-react";
import { useMap } from "react-map-gl/maplibre";

export default function ZoomControls() {
  const { current: map } = useMap();

  if (!map) return null;

  const handleZoomIn = () => {
    map.zoomIn({ essential: true });
  };

  const handleZoomOut = () => {
    map.zoomOut({ essential: true });
  };

  return (
    <div className="flex flex-col gap-4">
      <Button
        variant="secondary"
        size="lg"
        onClick={handleZoomIn}
        className="border-[1px] border-primary h-12"
      >
        <Plus />
      </Button>
      <Button
        variant="secondary"
        size="lg"
        onClick={handleZoomOut}
        className="border-[1px] border-primary h-12"
      >
        <Minus />
      </Button>
    </div>
  );
}
