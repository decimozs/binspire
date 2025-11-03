import DataTable from "@/features/data-table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@binspire/ui/components/dropdown-menu";
import { historyColumns } from "./columns";
import { Button } from "@binspire/ui/components/button";
import { Ellipsis } from "lucide-react";
import { useDeleteBatchHistories, type History } from "@binspire/query";
import PermittedActions from "@/features/permissions/permitted-actions";
import { usePermissionStore } from "@/store/permission-store";
import SelectedDataActions from "@/features/data-table/components/selected-data-actions";

export default function HistoryDataTable({
  data,
  recentChangesMode,
}: {
  data: History[];
  recentChangesMode?: boolean;
}) {
  const { permission } = usePermissionStore();

  return (
    <DataTable
      data={data}
      columns={historyColumns}
      facetedFilterColumns={["entity"]}
      recentChangesMode={recentChangesMode}
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
                type="historyManagement"
                actions={permission.historyManagement?.actions}
              />
            </DropdownMenuContent>
          </DropdownMenu>
        </>
      )}
      renderBatchActions={(selectedData, table) => {
        return (
          <SelectedDataActions<History>
            selectedData={selectedData}
            table={table}
            useDeleteBatchHook={useDeleteBatchHistories}
            actions={permission.historyManagement?.actions}
          />
        );
      }}
    />
  );
}
