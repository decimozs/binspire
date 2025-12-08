import type { History } from "@binspire/query";
import { useGetHistoryById } from "@binspire/query";
import type { ActionsTypeManagement } from "@binspire/shared";
import UserCard from "@/components/core/user-card";
import ViewContentLayout from "@/components/layout/view-content-layout";
import ActionDialogContainer from "@/components/views/action-dialog-container";
import { type ActionType, useActionDialog } from "@/hooks/use-action-dialog";
import HistoryDetails from "./history-details";

const keys: { queryKey: ActionsTypeManagement; actionKey: ActionType } = {
  queryKey: "historyManagement",
  actionKey: "view",
};

export default function ViewHistory() {
  const { queryId } = useActionDialog(keys);
  const { data: history, isPending } = useGetHistoryById(queryId!);

  return (
    <ActionDialogContainer keys={keys}>
      <ViewContentLayout<History>
        data={history}
        isPending={isPending}
        keys={keys}
        renderHeader={(data) => (
          <UserCard
            id={data.user.id}
            name={data.user.name}
            email={data.user.email}
            image={data.user.image!}
            label="Performed by"
          />
        )}
        renderComponents={(data) => <HistoryDetails data={data} />}
      />
    </ActionDialogContainer>
  );
}
