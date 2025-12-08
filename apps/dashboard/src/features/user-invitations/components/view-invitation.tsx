import { type UserInvitation, useGetUserInvitationById } from "@binspire/query";
import type {
  ActionsTypeManagement,
  UserPermission,
  UserRole,
} from "@binspire/shared";
import {
  InvitationStatusBadge,
  UserPermissionBadge,
  UserRoleBadge,
} from "@binspire/ui/badges";
import UserCard from "@/components/core/user-card";
import ViewContentLayout from "@/components/layout/view-content-layout";
import ActionDialogContainer from "@/components/views/action-dialog-container";
import { type ActionType, useActionDialog } from "@/hooks/use-action-dialog";

const keys: { queryKey: ActionsTypeManagement; actionKey: ActionType } = {
  queryKey: "invitationsManagement",
  actionKey: "view",
};

export default function ViewInvitation() {
  const { queryId } = useActionDialog(keys);
  const { data: invitation, isPending } = useGetUserInvitationById(queryId!);

  return (
    <ActionDialogContainer keys={keys}>
      <ViewContentLayout<UserInvitation>
        data={invitation}
        isPending={isPending}
        keys={keys}
        renderHeader={(data) => (
          <UserCard
            id={data.user.id}
            name={data.user.name}
            email={data.user.email}
            image={data.user.image!}
            label="Invited by"
          />
        )}
        renderComponents={(data) => (
          <div className="flex flex-col gap-3">
            <p className="text-muted-foreground">Details</p>
            <div className="flex flex-col text-sm gap-1">
              <p>Email</p>
              <p className="text-muted-foreground">{data.email}</p>
            </div>

            <div className="flex flex-row items-center gap-4">
              <div className="flex flex-col text-sm gap-1">
                <p>Status</p>
                <InvitationStatusBadge status={data.status} />
              </div>

              <div className="flex flex-col text-sm gap-1">
                <p>Role</p>
                <UserRoleBadge role={data.role as UserRole} />
              </div>

              <div className="flex flex-col text-sm gap-1">
                <p>Permission</p>
                <UserPermissionBadge
                  permission={data.permission as UserPermission}
                />
              </div>
            </div>
          </div>
        )}
      />
    </ActionDialogContainer>
  );
}
