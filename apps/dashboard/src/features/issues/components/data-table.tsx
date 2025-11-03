import DataTable from "@/features/data-table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@binspire/ui/components/dropdown-menu";
import { issueColumns } from "./columns";
import { Button } from "@binspire/ui/components/button";
import { Ellipsis } from "lucide-react";
import PermittedActions from "@/features/permissions/permitted-actions";
import { usePermissionStore } from "@/store/permission-store";
import { useDeleteBatchIssues, type Issue } from "@binspire/query";
import SelectedDataActions from "@/features/data-table/components/selected-data-actions";

export default function IssuesDataTable({
  data,
  recentChangesMode,
}: {
  data: Issue[];
  recentChangesMode?: boolean;
}) {
  const { permission } = usePermissionStore();

  return (
    <DataTable
      data={data}
      columns={issueColumns}
      facetedFilterColumns={["status", "priority", "entity"]}
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
                type="issueManagement"
                actions={permission.issueManagement?.actions}
              />
            </DropdownMenuContent>
          </DropdownMenu>
        </>
      )}
      renderBatchActions={(selectedData, table) => {
        return (
          <SelectedDataActions<Issue>
            selectedData={selectedData}
            table={table}
            useDeleteBatchHook={useDeleteBatchIssues}
            actions={permission.issueManagement?.actions}
          />
        );
      }}
    />
  );
}
