import type { History } from "@binspire/query";
import { formatCamelCase } from "@binspire/shared";

export default function AuditDetails({ data }: { data: History }) {
  return (
    <div className="flex flex-col gap-3">
      <p className="text-muted-foreground">Details</p>
      <div className="flex flex-col text-sm gap-1">
        <p>Title</p>
        <p className="text-muted-foreground">{data.title}</p>
      </div>

      <div className="grid grid-cols-2">
        <div className="flex flex-col text-sm gap-1">
          <p>Entity</p>
          <p className="text-xs px-3 py-1 rounded-md w-fit border-[1px] border-muted">
            {formatCamelCase(data.entity)}
          </p>
        </div>
      </div>
    </div>
  );
}
