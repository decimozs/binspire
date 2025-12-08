import { type Trashbin, useGetTrashbinById } from "@binspire/query";
import type { ActionsTypeManagement } from "@binspire/shared";
import ViewContentLayout from "@/components/layout/view-content-layout";
import ActionDialogContainer from "@/components/views/action-dialog-container";
import { type ActionType, useActionDialog } from "@/hooks/use-action-dialog";
import EditTrashbin from "./edit-trashbin";
import TrashbinDetails from "./trashbin-details";

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
