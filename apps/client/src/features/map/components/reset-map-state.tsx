import { useSession } from "@/features/auth";
import { useGetOrganizationSettingsById } from "@binspire/query";
import { Button } from "@binspire/ui/components/button";
import { ScanEye } from "lucide-react";
import { useMap } from "react-map-gl/maplibre";

export default function ResetMapState() {
  const { current: map } = useMap();
  const session = useSession();
  const { data: settings } = useGetOrganizationSettingsById(
    session.data?.user.orgId as string,
  );

  const currentSettings = settings?.settings;

  const handleResetMapState = () => {
    if (!map) return null;

    if (currentSettings?.general?.location) {
      map.flyTo({
        center: [
          currentSettings.general.location.lng!,
          currentSettings.general.location.lat!,
        ],
        zoom: 16.5,
        pitch: 70,
        bearing: 10,
        padding: {
          bottom: 0,
        },
        essential: true,
      });
    }
  };

  return (
    <Button
      variant="secondary"
      size="lg"
      onClick={handleResetMapState}
      className="h-12"
    >
      <ScanEye />
    </Button>
  );
}
