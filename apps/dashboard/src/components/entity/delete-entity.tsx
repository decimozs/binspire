import DeleteContentLayout from "@/components/layout/delete-content-layout";
import ActionDialogContainer from "@/components/views/action-dialog-container";
import { useActionDialog } from "@/hooks/use-action-dialog";
import type { ActionType } from "@/hooks/use-action-dialog";
import type { ActionsTypeManagement } from "@binspire/shared";

const ACTION_KEY: ActionType = "delete";

interface DeleteEntityProps {
  queryKey: ActionsTypeManagement;
  useDeleteHook: () => {
    mutateAsync: (id: string) => Promise<unknown>;
    isPending: boolean;
  };
}

export default function DeleteEntity({
  queryKey,
  useDeleteHook,
}: DeleteEntityProps) {
  const { queryId } = useActionDialog({ queryKey, actionKey: ACTION_KEY });
  const deleteData = useDeleteHook();

  const handleDelete = async (id: string) => {
    await deleteData.mutateAsync(id);
  };

  return (
    <ActionDialogContainer keys={{ queryKey, actionKey: ACTION_KEY }}>
      <DeleteContentLayout
        queryId={queryId!}
        queryKey={queryKey}
        onDelete={handleDelete}
        isPending={deleteData.isPending}
      />
    </ActionDialogContainer>
  );
}
