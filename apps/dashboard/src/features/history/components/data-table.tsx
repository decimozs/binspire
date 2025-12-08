import { type History, useDeleteBatchHistories } from "@binspire/query";
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
import { historyColumns } from "./columns";

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
      analytics
      analyticsLink="/analytics/history"
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
