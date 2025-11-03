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
    <div className="flex flex-col gap-2">
      <Button variant="ghost" size="sm" onClick={handleZoomIn}>
        <Plus />
      </Button>
      <Button variant="ghost" size="sm" onClick={handleZoomOut}>
        <Minus />
      </Button>
    </div>
  );
}
