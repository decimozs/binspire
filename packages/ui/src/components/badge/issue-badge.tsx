import {
  ISSUE_STATUS_CONFIG,
  PRIORITY_SCORES_CONFIG,
  type IssueStatus,
  type PriorityScores,
} from "@binspire/shared";

export function IssueStatusBadge({ status }: { status: IssueStatus }) {
  const state = ISSUE_STATUS_CONFIG[status];

  return (
    <div
      className={`flex items-center gap-1 text-xs ${state.style} px-3 py-1 rounded-md w-fit`}
    >
      <p className="capitalize">{state.label}</p>
    </div>
  );
}

export function IssuePriorityBadge({ priority }: { priority: PriorityScores }) {
  const state = PRIORITY_SCORES_CONFIG[priority];

  return (
    <div
      className={`flex items-center gap-1 text-xs ${state.style} px-3 py-1 rounded-md w-fit`}
    >
      <p className="capitalize">{state.label}</p>
    </div>
  );
}
