import type { Trashbin } from "@binspire/query";
import { Button } from "@binspire/ui/components/button";
import { useNavigate } from "@tanstack/react-router";
import { ArrowUpRight } from "lucide-react";
import CheckTrashbinStatus from "./check-trashbin-status";
import { useTrashbinRealtime } from "@/store/realtime-store";
import { useTelemetryStore } from "@/store/telemetry-store";
import WarningSign from "@/components/sign/warnings";
import TrashbinLogs from "./trashbin-logs";

export default function TrashbinDetails({ data }: { data: Trashbin }) {
  const navigate = useNavigate();
  const isTelemetryConnected = useTelemetryStore((state) => state.isConnected);
  const realtimeTrashbins = useTrashbinRealtime((state) => state.bins);

  const hasValidConnection =
    isTelemetryConnected && Object.entries(realtimeTrashbins).length > 0;

  const handleViewCollectionHistory = () => {
    navigate({
      to: `/collections?search=${data.id}`,
    });
  };

  return (
    <>
      <div className="text-sm grid grid-cols-1 gap-4">
        <div>
          <p>Name</p>
          <p className="text-muted-foreground">{data.name}</p>
        </div>

        <div>
          <p>Location</p>
          <p className="text-muted-foreground">{data.location}</p>
        </div>

        <div>
          <p>Waste Type</p>
          <p className="text-muted-foreground capitalize">{data.wasteType}</p>
        </div>

        <div className="flex flex-col gap-3">
          {!hasValidConnection && (
            <WarningSign
              message="Telemetry is not connected. Checking trashbin status is unavailable."
              iconSize={18}
              className="text-sm"
              iconClassName="mt-1"
            />
          )}
          <div className="text-sm flex flex-row items-center gap-2 w-full">
            {hasValidConnection && <CheckTrashbinStatus id={data.id} />}
            {hasValidConnection && <TrashbinLogs id={data.id} />}
            <Button
              variant="outline"
              size="lg"
              className="grow"
              onClick={handleViewCollectionHistory}
            >
              History
              <ArrowUpRight className="mt-0.3" />
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}
