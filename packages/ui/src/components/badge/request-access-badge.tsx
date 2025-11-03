import { REQUEST_STATUS_CONFIG, type RequestStatus } from "@binspire/shared";

export function RequestAccessStatusBadge({
  status,
}: {
  status: RequestStatus;
}) {
  const state = REQUEST_STATUS_CONFIG[status];

  return (
    <div
      className={`flex items-center gap-1 text-xs ${state.style} px-3 py-1 rounded-md w-fit`}
    >
      <p className="capitalize">{state.label}</p>
    </div>
  );
}
