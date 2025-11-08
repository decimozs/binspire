import { useTrashbinRealtime } from "@/store/realtime-store";
import { useQueryState } from "nuqs";
import { TrashbinStatus as TrashbinStatusBadge } from "@/components/badges";
import WarningSign from "@/components/warning-sign";

export default function TrashbinStatus() {
  const [trashbinId] = useQueryState("trashbin_id");
  const bins = useTrashbinRealtime((state) => state.bins);
  const bin = bins[trashbinId!];

  if (!bin) {
    return (
      <WarningSign
        message="Telemetry is connected. Checking trashbin status availability."
        iconSize={18}
        className="text-sm mt-4 -mb-4"
        iconClassName="mt-1"
      />
    );
  }

  const { wasteLevel, weightLevel, batteryLevel } = bin;

  const MAX_DISTANCE = 53;
  const fillLevel = Math.max(
    0,
    Math.min(100, ((MAX_DISTANCE - wasteLevel) / MAX_DISTANCE) * 100),
  );

  return (
    <div className="grid grid-cols-1 gap-2 mt-2">
      <div>
        <p className="mb-1">Status</p>
      </div>
      <div className="flex flex-row items-center justify-between font-bold">
        <p>Waste Level</p>
        <TrashbinStatusBadge
          label="Waste Level"
          value={Number(fillLevel.toFixed(0))}
          unit="%"
          type="waste-level"
          enabledColumn={true}
        />
      </div>
      <div className="flex flex-row items-center justify-between font-bold">
        <p>Weight Level</p>
        <TrashbinStatusBadge
          label="Weight Level"
          value={weightLevel}
          unit="kg"
          type="weight-level"
          enabledColumn={true}
        />
      </div>
      <div className="flex flex-row items-center justify-between font-bold">
        <p>Battery Level</p>
        <TrashbinStatusBadge
          label="Battery Level"
          value={batteryLevel}
          unit="%"
          type="battery-level"
          enabledColumn={true}
        />
      </div>
    </div>
  );
}
