import ActionDialogContainer from "@/components/views/action-dialog-container";
import ViewContentLayout from "@/components/layout/view-content-layout";
import { useActionDialog, type ActionType } from "@/hooks/use-action-dialog";
import UserCard from "@/components/core/user-card";
import RequestDetails from "./request-details";
import UpdateOptions from "./update-options";
import { Separator } from "@binspire/ui/components/separator";
import type { ActionsTypeManagement } from "@binspire/shared";
import {
  useGetUserRequestById,
  useGetUserStatusByUserId,
  type UserRequest,
} from "@binspire/query";
import { usePermissionStore } from "@/store/permission-store";

const keys: { queryKey: ActionsTypeManagement; actionKey: ActionType } = {
  queryKey: "accessRequestsManagement",
  actionKey: "view",
};

export default function ViewRequests() {
  const { queryId } = useActionDialog(keys);
  const { data: request, isPending } = useGetUserRequestById(queryId!);
  const { data: user } = useGetUserStatusByUserId(request?.userId as string);
  const { permission } = usePermissionStore();

  if (!user) return null;

  const hasPermission = permission.accessRequestsManagement?.actions.update;

  return (
    <ActionDialogContainer keys={keys}>
      <ViewContentLayout<UserRequest>
        data={request}
        isPending={isPending}
        keys={keys}
        renderHeader={(data) => (
          <UserCard
            id={data.user.id}
            name={data.user.name}
            email={data.user.email}
            image={data.user.image!}
            label="Requested by"
          />
        )}
        renderComponents={(data) => (
          <>
            <RequestDetails data={data} />
            {hasPermission && (
              <>
                <Separator />
                <UpdateOptions data={user} requestId={queryId!} />
              </>
            )}
          </>
        )}
      />
    </ActionDialogContainer>
  );
}
