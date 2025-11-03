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
      <Button variant="secondary" size="lg" onClick={handleZoomIn}>
        <Plus />
      </Button>
      <Button variant="secondary" size="lg" onClick={handleZoomOut}>
        <Minus />
      </Button>
    </div>
  );
}
