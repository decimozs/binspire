import { Minus, Plus } from "lucide-react";
import { Button } from "../ui/button";
import { useMap } from "react-map-gl/maplibre";

export default function MapZoom() {
  const { current: map } = useMap();
  const handleMapZoomIn = () => {
    map?.zoomIn({ essential: true });
  };
  const handleMapZoomOut = () => {
    map?.zoomOut({ essential: true });
  };

  return (
    <div className="flex flex-col bg-muted rounded-md">
      <Button variant="secondary" size="icon" onClick={handleMapZoomIn}>
        <Plus />
      </Button>
      <Button variant="secondary" size="icon" onClick={handleMapZoomOut}>
        <Minus />
      </Button>
    </div>
  );
}
