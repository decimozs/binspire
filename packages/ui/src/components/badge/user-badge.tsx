import {
  getInitial,
  USER_PERMISSION_CONFIG,
  USER_ROLE_CONFIG,
  type UserPermission,
  type UserRole,
} from "@binspire/shared";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@binspire/ui/components/avatar";

export function UserRoleBadge({ role }: { role: UserRole }) {
  const state = USER_ROLE_CONFIG[role];

  return (
    <div
      className={`flex items-center gap-1 text-xs ${state.style} px-3 py-1 rounded-md w-fit`}
    >
      <p className="capitalize">{state.label}</p>
    </div>
  );
}

export function UserColumn({
  name,
  imageUrl,
  email,
}: {
  name: string;
  imageUrl: string;
  email?: string;
}) {
  return (
    <div className="flex flex-row items-center gap-2">
      <Avatar>
        <AvatarImage src={imageUrl} />
        <AvatarFallback>{getInitial(name)}</AvatarFallback>
      </Avatar>
      <div className="flex flex-col">
        <p>{name}</p>
        {email && (
          <p className="-mt-1 text-sm text-muted-foreground">{email}</p>
        )}
      </div>
    </div>
  );
}

export function UserPermissionBadge({
  permission,
}: {
  permission: UserPermission;
}) {
  const state = USER_PERMISSION_CONFIG[permission];

  return (
    <div
      className={`flex items-center gap-1 text-xs ${state.style} px-3 py-1 rounded-md w-fit`}
    >
      <p className="capitalize">{state.label}</p>
    </div>
  );
}
