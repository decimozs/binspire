import {
  type TrashbinCollections,
  useGetTrashbinCollectionsById,
} from "@binspire/query";
import type { ActionsTypeManagement } from "@binspire/shared";
import UserCard from "@/components/core/user-card";
import ViewContentLayout from "@/components/layout/view-content-layout";
import ActionDialogContainer from "@/components/views/action-dialog-container";
import { type ActionType, useActionDialog } from "@/hooks/use-action-dialog";
import CollectionLogs from "./collection-logs";
import TrashbinDetails from "./trashbin-details";

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
        renderComponents={(data) => {
          return (
            <div className="flex flex-col gap-4">
              <TrashbinDetails data={data} />
              <CollectionLogs logsRaw={data.logs!} />
            </div>
          );
        }}
      />
    </ActionDialogContainer>
  );
}
