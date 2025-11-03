import type { Issue } from "@binspire/query";
import { formatCamelCase } from "@binspire/shared";
import { IssuePriorityBadge, IssueStatusBadge } from "@binspire/ui/badges";
import { Textarea } from "@binspire/ui/components/textarea";

export default function IssueDetails({ data }: { data: Issue }) {
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
          <p>Entity</p>
          <p className="text-xs px-3 py-1 rounded-md w-fit border-[1px] border-muted">
            {formatCamelCase(data.entity)}
          </p>
        </div>

        <div className="flex flex-row gap-2">
          <div className="flex flex-col text-sm gap-1">
            <p>Priority</p>
            <IssuePriorityBadge priority={data.priority} />
          </div>

          <div className="flex flex-col text-sm gap-1">
            <p>Status</p>
            <IssueStatusBadge status={data.status} />
          </div>
        </div>
      </div>
    </div>
  );
}
