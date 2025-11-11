import WarningSign from "@/components/warning-sign";
import { NAVIGATION_PROFILES } from "@/features/settings/lib/constants";
import { useTrashbinRealtime } from "@/store/realtime-store";
import { useRouteStore } from "@/store/route-store";
import { useTelemetryStore } from "@/store/telemetry-store";
import { useGetTrashbinById } from "@binspire/query";
import { formatLabel } from "@binspire/shared";
import { Button } from "@binspire/ui/components/button";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@binspire/ui/components/drawer";
import { Info } from "lucide-react";
import { useQueryState } from "nuqs";
import { useState } from "react";
import RouteSegments from "./route-segments";
import ReportIssue from "@/features/report-issue";

function TrashbinInfo() {
  const [markTrashbin] = useQueryState("mark_trashbin_id");
  const { data } = useGetTrashbinById(markTrashbin || "");
  const isTelemetryConnected = useTelemetryStore((state) => state.isConnected);
  const realtimeTrashbins = useTrashbinRealtime((state) => state.bins);
  const hasValidConnection =
    isTelemetryConnected && Object.entries(realtimeTrashbins).length > 0;

  return (
    <div>
      <DrawerHeader>
        <div className="relative">
          <div>
            <DrawerTitle className="font-bold text-4xl text-left">
              Trashbin
            </DrawerTitle>
            <DrawerDescription className="text-left text-lg font-bold">
              ID: {markTrashbin}
            </DrawerDescription>
          </div>
          <div className="absolute top-0 right-0">
            <ReportIssue label="Report Trashbin" entity="trashbinManagement" />
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
        {!hasValidConnection && (
          <WarningSign
            message="Telemetry is not connected. Checking trashbin status is unavailable."
            iconSize={18}
            className="text-sm mt-4 -mb-4"
            iconClassName="mt-1"
          />
        )}
      </div>
    </div>
  );
}

function DirectionsInfo() {
  const { route } = useRouteStore();
  const feature = route?.features?.[0];
  const distance = feature?.properties?.summary?.distance ?? 0;
  const duration = feature?.properties?.summary?.duration ?? 0;
  const warnings =
    feature?.properties?.warnings?.map((w: any) => w.message) ?? [];
  const segment = feature?.properties?.segments?.[0];
  const profile = route?.metadata?.query?.profile ?? "driving";
  const steps = segment?.steps ?? [];

  const { icon: ProfileIcon, label: profileLabel } =
    NAVIGATION_PROFILES[profile as keyof typeof NAVIGATION_PROFILES] ||
    NAVIGATION_PROFILES.default;

  return (
    <div>
      <DrawerHeader>
        <div className="relative">
          <div>
            <DrawerTitle className="font-bold text-4xl text-left">
              Directions
            </DrawerTitle>
            <DrawerDescription className="flex flex-row items-center gap-2 text-left text-lg font-bold">
              <ProfileIcon className="w-5 h-5 text-primary" />
              {profileLabel}
            </DrawerDescription>
          </div>
          <div className="absolute top-0 right-0">
            <ReportIssue label="Report Directions" entity="mapManagement" />
          </div>
        </div>
      </DrawerHeader>
      <div className="px-4 text-xl grid grid-cols-1 gap-1">
        {warnings && warnings.length > 0 && (
          <WarningSign
            message={warnings}
            iconSize={18}
            className="text-sm mb-4"
          />
        )}
        <div className="flex flex-row items-center justify-between font-bold">
          <p>Total Distance</p>
          <p className="text-muted-foreground">
            {(distance / 1000).toFixed(2) + " km"}
          </p>
        </div>
        <div className="flex flex-row items-center justify-between font-bold">
          <p>ETA</p>
          <p className="text-muted-foreground">
            {Math.round(duration / 60) + " min"}
          </p>
        </div>
        <span className="mt-2" />
        <RouteSegments steps={steps} />
      </div>
    </div>
  );
}

export default function NavigationInfo() {
  const [activeTab, setActiveTab] = useState<"trashbin" | "direction">(
    "trashbin",
  );

  return (
    <Drawer modal={false}>
      <DrawerTrigger asChild>
        <Button variant="secondary" className="z-50">
          <Info />
        </Button>
      </DrawerTrigger>

      <DrawerContent showOverlay={false} className="pb-4">
        <div className="px-4 grid grid-cols-2 gap-2 mt-4">
          <Button
            variant={activeTab === "trashbin" ? "default" : "outline"}
            className={
              activeTab === "trashbin" ? "font-bold text-xl" : "text-xl"
            }
            onClick={() => setActiveTab("trashbin")}
          >
            Trashbin
          </Button>
          <Button
            variant={activeTab === "direction" ? "default" : "outline"}
            className={
              activeTab === "direction" ? "font-bold text-xl" : "text-xl"
            }
            onClick={() => setActiveTab("direction")}
          >
            Directions
          </Button>
        </div>

        <div>
          {activeTab === "trashbin" ? <TrashbinInfo /> : <DirectionsInfo />}
        </div>
      </DrawerContent>
    </Drawer>
  );
}
