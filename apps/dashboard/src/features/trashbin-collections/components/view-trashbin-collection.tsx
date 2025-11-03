import ActionDialogContainer from "@/components/views/action-dialog-container";
import ViewContentLayout from "@/components/layout/view-content-layout";
import { useActionDialog, type ActionType } from "@/hooks/use-action-dialog";
import TrashbinDetails from "./trashbin-details";
import UserCard from "@/components/core/user-card";
import type { ActionsTypeManagement } from "@binspire/shared";
import {
  useGetTrashbinCollectionsById,
  type TrashbinCollections,
} from "@binspire/query";

const keys: { queryKey: ActionsTypeManagement; actionKey: ActionType } = {
  queryKey: "collectionsManagement",
  actionKey: "view",
};

export default function ViewTrashbinCollection() {
  const { queryId } = useActionDialog(keys);
  const { data: trashbinCollection, isPending } = useGetTrashbinCollectionsById(
    queryId!,
  );

  return (
    <ActionDialogContainer keys={keys}>
      <ViewContentLayout<TrashbinCollections>
        data={trashbinCollection}
        isPending={isPending}
        keys={keys}
        renderHeader={(data) => (
          <UserCard
            id={data.collector.id}
            name={data.collector.name}
            email={data.collector.email}
            image={data.collector.image!}
            label="Collected by"
          />
        )}
        renderComponents={(data) => <TrashbinDetails data={data} />}
      />
    </ActionDialogContainer>
  );
}
