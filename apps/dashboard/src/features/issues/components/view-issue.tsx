import { type Issue, useGetIssueById } from "@binspire/query";
import type { ActionsTypeManagement } from "@binspire/shared";
import UserCard from "@/components/core/user-card";
import ViewContentLayout from "@/components/layout/view-content-layout";
import ActionDialogContainer from "@/components/views/action-dialog-container";
import { type ActionType, useActionDialog } from "@/hooks/use-action-dialog";
import EditIssue from "./edit-issue";
import IssueDetails from "./issue-details";

const FORM_ID = "issue-edit-form";
const keys: { queryKey: ActionsTypeManagement; actionKey: ActionType } = {
  queryKey: "issueManagement",
  actionKey: "view",
};

export default function ViewIssue() {
  const { queryId, editMode } = useActionDialog(keys);
  const { data: issue, isPending } = useGetIssueById(queryId!);

  return (
    <ActionDialogContainer keys={keys}>
      <ViewContentLayout<Issue>
        data={issue}
        isPending={isPending}
        keys={keys}
        enabledEditMode={true}
        renderHeader={(data) => (
          <UserCard
            id={data.userId}
            name={data.user.name}
            email={data.user.email}
            image={data.user.image!}
            label="Issued by"
          />
        )}
        renderComponents={(data) =>
          !editMode ? (
            <IssueDetails data={data} />
          ) : (
            <EditIssue data={data} formId={FORM_ID} />
          )
        }
      />
    </ActionDialogContainer>
  );
}
