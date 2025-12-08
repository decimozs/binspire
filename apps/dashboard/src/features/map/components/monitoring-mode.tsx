import { useGetOrganizationSettingsById } from "@binspire/query";
import { Button } from "@binspire/ui/components/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@binspire/ui/components/dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@binspire/ui/components/tooltip";
import { Monitor, MonitorOff } from "lucide-react";
import { useState } from "react";
import { useMap } from "react-map-gl/maplibre";
import { authClient } from "@/lib/auth-client";
import { useMonitoringStore } from "@/store/monitoring-store";

export default function MonitoringMode() {
  const { current: map } = useMap();
  const [open, setOpen] = useState(false);
  const { enabled, setEnabled } = useMonitoringStore();
  const session = authClient.useSession();
  const { data: settings } = useGetOrganizationSettingsById(
    session.data?.user.orgId as string,
  );

  const currentSettings = settings?.settings;

  const handleEnable = () => {
    if (!map) return;

    if (currentSettings?.general?.location) {
      map.flyTo({
        center: [
          currentSettings.general.location.lng,
          currentSettings.general.location.lat,
        ],
        zoom: 17,
        pitch: 70,
        bearing: 10,
        essential: true,
      });
    }

    setEnabled(true);
    setOpen(false);
  };

  const handleDisable = () => {
    if (!map) return;

    if (currentSettings?.general?.location) {
      map.flyTo({
        center: [
          currentSettings.general.location.lng,
          currentSettings.general.location.lat,
        ],
        zoom: 18,
        pitch: 70,
        bearing: 10,
        essential: true,
      });
    }

    setEnabled(false);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <Tooltip>
        <TooltipTrigger asChild>
          <DialogTrigger asChild>
            <Button variant="ghost" size="sm" title="Monitoring Mode">
              {enabled ? <Monitor /> : <MonitorOff />}
            </Button>
          </DialogTrigger>
        </TooltipTrigger>
        <TooltipContent side="left">
          <p className="font-bold">Monitoring Mode</p>
        </TooltipContent>
      </Tooltip>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {enabled ? "Disable Monitoring Mode" : "Enable Monitoring Mode"}
          </DialogTitle>
          <DialogDescription>
            Monitoring Mode keeps the map active for real-time tracking of
            trashbin statuses and locations, while disabling other actions to
            prevent accidental changes.
          </DialogDescription>
        </DialogHeader>

        <DialogFooter>
          <DialogClose asChild>
            <Button variant="secondary" size="sm">
              Cancel
            </Button>
          </DialogClose>

          {enabled ? (
            <Button size="sm" variant="destructive" onClick={handleDisable}>
              Disable
            </Button>
          ) : (
            <Button size="sm" onClick={handleEnable}>
              Enable
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
