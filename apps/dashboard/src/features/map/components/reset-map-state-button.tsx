import { authClient } from "@/lib/auth-client";
import { useGetOrganizationSettingsById } from "@binspire/query";
import { Button } from "@binspire/ui/components/button";
import { ScanEye } from "lucide-react";
import { useMap } from "react-map-gl/maplibre";

export default function ResetMapStateButton() {
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
        zoom: 18,
        pitch: 70,
        bearing: 10,
      });
    }
  };

  return (
    <Button variant="ghost" size="sm" onClick={handleResetMapState}>
      <ScanEye />
    </Button>
  );
}
