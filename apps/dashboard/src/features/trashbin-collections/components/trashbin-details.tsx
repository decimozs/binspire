import type { TrashbinCollections } from "@binspire/query";
import { TrashbinStatusBadge } from "@binspire/ui/badges";

export function TrashbinStatus({
  label,
  value,
  unit,
  type,
  enabledColumn = false,
}: {
  label: string;
  value: number;
  unit?: string;
  type: "waste-level" | "weight-level" | "battery-level" | "solar-power";
  enabledColumn?: boolean;
}) {
  return (
    <div className="flex flex-col text-sm gap-1">
      {!enabledColumn && <p>{label}</p>}
      <div className="flex flex-row items-center gap-2">
        <p className="text-muted-foreground">
          {value} {unit}
        </p>
        <TrashbinStatusBadge type={type} level={value} />
      </div>
    </div>
  );
}

export default function TrashbinDetails({
  data,
}: {
  data: TrashbinCollections;
}) {
  return (
    <div className="flex flex-col gap-3">
      <p className="text-muted-foreground">Trashbin Details</p>

      <div className="flex flex-row items-center justify-between">
        <TrashbinStatus
          label="Waste Level"
          value={data.wasteLevel!}
          unit="%"
          type="waste-level"
        />
        <TrashbinStatus
          label="Weight Level"
          value={data.weightLevel!}
          unit="kg"
          type="weight-level"
        />
        <TrashbinStatus
          label="Battery Level"
          value={data.batteryLevel!}
          unit="%"
          type="battery-level"
        />
      </div>
    </div>
  );
}
