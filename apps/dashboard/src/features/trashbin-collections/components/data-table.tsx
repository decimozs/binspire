import {
  type TrashbinCollections,
  useDeleteBatchTrashbinCollections,
} from "@binspire/query";
import { Button } from "@binspire/ui/components/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@binspire/ui/components/dropdown-menu";
import { Ellipsis } from "lucide-react";
import DataTable from "@/features/data-table";
import SelectedDataActions from "@/features/data-table/components/selected-data-actions";
import PermittedActions from "@/features/permissions/permitted-actions";
import { usePermissionStore } from "@/store/permission-store";
import { trashbinCollectionColumns } from "./columns";

export default function TrashbinCollectionsDataTable({
  data,
  recentChangesMode,
}: {
  data: TrashbinCollections[];
  recentChangesMode?: boolean;
}) {
  const { permission } = usePermissionStore();

  return (
    <DataTable
      data={data}
      columns={trashbinCollectionColumns}
      recentChangesMode={recentChangesMode}
      analytics
      analyticsLink="/analytics"
      renderActions={(item) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <Ellipsis />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <PermittedActions
              itemId={item.id}
              type="collectionsManagement"
              actions={permission.collectionsManagement?.actions}
            />
          </DropdownMenuContent>
        </DropdownMenu>
      )}
      renderBatchActions={(selectedData, table) => {
        return (
          <SelectedDataActions<TrashbinCollections>
            selectedData={selectedData}
            table={table}
            useDeleteBatchHook={useDeleteBatchTrashbinCollections}
            actions={permission.collectionsManagement?.actions}
          />
        );
      }}
    />
  );
}
