import { type Trashbin, useDeleteBatchTrashbins } from "@binspire/query";
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
import { trashbinColumns } from "./columns";

export default function TrashbinsDataTable({
  data,
  recentChangesMode,
}: {
  data: Trashbin[];
  recentChangesMode?: boolean;
}) {
  const { permission } = usePermissionStore();

  return (
    <DataTable
      data={data}
      columns={trashbinColumns}
      facetedFilterColumns={["wasteType"]}
      recentChangesMode={recentChangesMode}
      analytics
      analyticsLink="/analytics/trashbins"
      renderActions={(item) => (
        <>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <Ellipsis />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <PermittedActions
                itemId={item.id}
                type="trashbinManagement"
                actions={permission.trashbinManagement?.actions}
              />
            </DropdownMenuContent>
          </DropdownMenu>
        </>
      )}
      renderBatchActions={(selectedData, table) => {
        return (
          <SelectedDataActions<Trashbin>
            selectedData={selectedData}
            table={table}
            useDeleteBatchHook={useDeleteBatchTrashbins}
            actions={permission.trashbinManagement?.actions}
          />
        );
      }}
    />
  );
}
