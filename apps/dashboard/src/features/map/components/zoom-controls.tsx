import { Button } from "@binspire/ui/components/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@binspire/ui/components/tooltip";
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
      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="ghost" size="sm" onClick={handleZoomIn}>
            <Plus />
          </Button>
        </TooltipTrigger>
        <TooltipContent side="left">
          <p className="font-bold">Zoom In</p>
        </TooltipContent>
      </Tooltip>

      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="ghost" size="sm" onClick={handleZoomOut}>
            <Minus />
          </Button>
        </TooltipTrigger>
        <TooltipContent side="left">
          <p className="font-bold">Zoom Out</p>
        </TooltipContent>
      </Tooltip>
    </div>
  );
}
