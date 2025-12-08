import { useGetOrganizationSettingsById } from "@binspire/query";
import { Button } from "@binspire/ui/components/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@binspire/ui/components/tooltip";
import { ScanEye } from "lucide-react";
import { useMap } from "react-map-gl/maplibre";
import { authClient } from "@/lib/auth-client";

export default function ResetMapStateButton({
  zoomLevel = 18,
}: {
  zoomLevel?: number;
}) {
  const { current: map } = useMap();
  const session = authClient.useSession();
  const { data: settings } = useGetOrganizationSettingsById(
    session.data?.user.orgId as string,
  );

  const currentSettings = settings?.settings;

  const handleResetMapState = () => {
    if (!map) return null;

    if (currentSettings?.general?.location) {
      map.flyTo({
        center: [
          currentSettings.general.location.lng,
          currentSettings.general.location.lat,
        ],
        zoom: zoomLevel,
        pitch: 70,
        bearing: 10,
      });
    }
  };

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button variant="ghost" size="sm" onClick={handleResetMapState}>
          <ScanEye />
        </Button>
      </TooltipTrigger>
      <TooltipContent side="left">
        <p className="font-bold">Reset View</p>
      </TooltipContent>
    </Tooltip>
  );
}
