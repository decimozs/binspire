import type { UserRequest } from "@binspire/query";
import { formatLabel } from "@binspire/shared";
import { RequestAccessStatusBadge } from "@binspire/ui/badges";
import { Textarea } from "@binspire/ui/components/textarea";

export default function RequestDetails({ data }: { data: UserRequest }) {
  return (
    <div className="flex flex-col gap-3">
      <p className="text-muted-foreground">Details</p>
      <div className="flex flex-col text-sm gap-1">
        <p>Title</p>
        <p className="text-muted-foreground">{data.title}</p>
      </div>

      <div className="flex flex-col text-sm gap-1">
        <p>Description</p>
        <Textarea value={data.description} disabled={true} />
      </div>

      <div className="grid grid-cols-2">
        <div className="flex flex-col text-sm gap-1">
          <p>Type</p>
          <p className="text-xs px-3 py-1 rounded-md w-fit border-[1px] border-muted">
            {formatLabel(data.type)}
          </p>
        </div>

        <div className="flex flex-col text-sm gap-1">
          <p>Status</p>
          <RequestAccessStatusBadge status={data.status} />
        </div>
      </div>
    </div>
  );
}
