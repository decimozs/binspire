import ViewContentLayout from "@/components/layout/view-content-layout";
import ActionDialogContainer from "@/components/views/action-dialog-container";
import TrashbinDetails from "./trashbin-details";
import EditTrashbin from "./edit-trashbin";
import type { ActionsTypeManagement } from "@binspire/shared";
import { useActionDialog, type ActionType } from "@/hooks/use-action-dialog";
import { useGetTrashbinById, type Trashbin } from "@binspire/query";

const FORM_ID = "trashbin-edit-form";
const keys: { queryKey: ActionsTypeManagement; actionKey: ActionType } = {
  queryKey: "trashbinManagement",
  actionKey: "view",
};

export default function ViewTrashbin() {
  const { queryId, editMode } = useActionDialog(keys);
  const { data: trashbin, isPending } = useGetTrashbinById(queryId!);

  return (
    <ActionDialogContainer keys={keys}>
      <ViewContentLayout<Trashbin>
        data={trashbin}
        isPending={isPending}
        keys={keys}
        enabledEditMode={true}
        renderComponents={(data) => (
          <div>
            <div className="flex flex-col gap-3">
              <p className="text-muted-foreground">Details</p>
              {!editMode ? (
                <TrashbinDetails data={data} />
              ) : (
                <EditTrashbin data={trashbin!} formId={FORM_ID} />
              )}
            </div>
          </div>
        )}
      />
    </ActionDialogContainer>
  );
}
