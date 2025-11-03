import { useEffect, useState } from "react";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@binspire/ui/components/drawer";
import { parseAsBoolean, useQueryState } from "nuqs";
import {
  useGetOrganizationSettingsById,
  useGetTrashbinById,
} from "@binspire/query";
import { formatLabel } from "@binspire/shared";
import { useTrashbinRealtime } from "@/store/realtime-store";
import { useTelemetryStore } from "@/store/telemetry-store";
import WarningSign from "@/components/warning-sign";
import { Button } from "@binspire/ui/components/button";
import { Loader2 } from "lucide-react";
import CollectTrashbin from "./collect-trashbin";
import GetRoute from "../map/components/get-route";
import SelectProfile from "../map/components/select-profile";
import { useSession } from "../auth";
import { useMap } from "react-map-gl/maplibre";
import TrashbinStatus from "./trashbin-status";
import ReportIssue from "../report-issue";

export default function ViewTrashbin() {
  const [trashbin, setTrashbinQuery] = useQueryState("trashbin_id");
  const [latQuery, setLatQuery] = useQueryState("lat");
  const [lngQuery, setLngQuery] = useQueryState("lng");
  const [selectProfileQuery] = useQueryState(
    "select_profile",
    parseAsBoolean.withDefault(false),
  );
  const [open, setOpen] = useState(false);
  const { data, isPending } = useGetTrashbinById(trashbin || "");
  const isTelemetryConnected = useTelemetryStore((state) => state.isConnected);
  const { current: map } = useMap();
  const realtimeTrashbins = useTrashbinRealtime((state) => state.bins);
  const isCollected =
    data?.status.isCollected &&
    !data?.status.isScheduled &&
    data?.status.scheduledAt === null;
  const hasValidConnection =
    isTelemetryConnected && Object.entries(realtimeTrashbins).length > 0;
  const session = useSession();
  const { data: settings } = useGetOrganizationSettingsById(
    session.data?.user.orgId as string,
  );
  const currentSettings = settings?.settings;

  useEffect(() => {
    setOpen(!!trashbin);
    setOpen(!!latQuery);
    setOpen(!!lngQuery);
  }, [trashbin]);

  const handleOpenChange = (isOpen: boolean) => {
    setOpen(isOpen);

    if (!isOpen) {
      const timeout = setTimeout(() => {
        setTrashbinQuery(null);
        setLatQuery(null);
        setLngQuery(null);

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
      }, 300);

      return () => clearTimeout(timeout);
    }
  };

  if (isPending) {
    return (
      <Drawer open={open} onOpenChange={handleOpenChange} modal={false}>
        <DrawerTrigger className="hidden">Open</DrawerTrigger>
        <DrawerContent>
          <Loader2 className="animate-spin" />
        </DrawerContent>
      </Drawer>
    );
  }

  return (
    <Drawer open={open} onOpenChange={handleOpenChange} modal={false}>
      <DrawerTrigger className="hidden">Open</DrawerTrigger>
      <DrawerContent showOverlay={false}>
        <DrawerHeader>
          <div className="relative">
            <div>
              <DrawerTitle className="font-bold text-xl text-left">
                Trashbin
              </DrawerTitle>
              <DrawerDescription className="text-left">
                ID: {trashbin}
              </DrawerDescription>
            </div>
            <div className="absolute top-0 right-0">
              <ReportIssue
                label="Report Trashbin"
                entity="trashbinManagement"
              />
            </div>
          </div>
        </DrawerHeader>
        <div className="px-4 pb-4 text-xl grid grid-cols-1 gap-1">
          <div className="flex flex-row items-center justify-between font-bold">
            <p>Name</p>
            <p className="text-muted-foreground">{data?.name}</p>
          </div>
          <div className="flex flex-row items-center justify-between font-bold">
            <p>Location</p>
            <p className="text-muted-foreground">{data?.location}</p>
          </div>
          <div className="flex flex-row items-center justify-between font-bold">
            <p>Waste Type</p>
            <p className="text-muted-foreground">
              {formatLabel(data?.wasteType as string)}
            </p>
          </div>
          {!hasValidConnection ? (
            <WarningSign
              message="Telemetry is not connected. Checking trashbin status is unavailable."
              iconSize={18}
              className="text-sm mt-4 -mb-4"
              iconClassName="mt-1"
            />
          ) : (
            <TrashbinStatus />
          )}
        </div>
        <DrawerFooter>
          <div className="grid grid-cols-[1fr_50px] w-full gap-2">
            {selectProfileQuery ? (
              <SelectProfile />
            ) : isCollected ? (
              <Button disabled>Collected</Button>
            ) : (
              <CollectTrashbin />
            )}
            <GetRoute />
          </div>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
