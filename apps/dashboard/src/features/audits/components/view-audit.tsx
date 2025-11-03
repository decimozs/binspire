import ActionDialogContainer from "@/components/views/action-dialog-container";
import ViewContentLayout from "@/components/layout/view-content-layout";
import { useActionDialog, type ActionType } from "@/hooks/use-action-dialog";
import AuditDetails from "./audit-details";
import UserCard from "@/components/core/user-card";
import type { ActionsTypeManagement } from "@binspire/shared";
import { useGetAuditById } from "@binspire/query";
import type { Audit } from "@binspire/query";

const keys: { queryKey: ActionsTypeManagement; actionKey: ActionType } = {
  queryKey: "activityManagement",
  actionKey: "view",
};

export default function ViewAudit() {
  const { queryId } = useActionDialog(keys);
  const { data: audits, isPending } = useGetAuditById(queryId!);

  return (
    <ActionDialogContainer keys={keys}>
      <ViewContentLayout<Audit>
        data={audits}
        isPending={isPending}
        keys={keys}
        renderHeader={(data) => (
          <UserCard
            id={data.user.id}
            name={data.user.name}
            email={data.user.email}
            image={data.user.image!}
            label="Committed by"
          />
        )}
        renderComponents={(data) => <AuditDetails data={data} />}
      />
    </ActionDialogContainer>
  );
}
