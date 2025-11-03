import { ACTION_CONFIG, type AuditActions } from "@binspire/shared";

export function AuditActionBadge({ action }: { action: AuditActions }) {
  const state = ACTION_CONFIG[action];

  return (
    <div
      className={`flex items-center gap-1 text-xs ${state.style} px-3 py-1 rounded-md w-fit`}
    >
      <p className="capitalize">{state.label}</p>
    </div>
  );
}
