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
  type: "waste-level" | "weight-level" | "battery-level";
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
