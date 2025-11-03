import {
  USER_INVITATION_STATUS_CONFIG,
  type InvitationStatus,
} from "@binspire/shared";

export function InvitationStatusBadge({
  status,
}: {
  status: InvitationStatus;
}) {
  const state = USER_INVITATION_STATUS_CONFIG[status];

  return (
    <div
      className={`flex items-center gap-1 text-xs ${state.style} px-3 py-1 rounded-md w-fit`}
    >
      <p className="capitalize">{state.label}</p>
    </div>
  );
}
