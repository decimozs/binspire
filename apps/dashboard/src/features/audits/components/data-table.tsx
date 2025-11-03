import DataTable from "@/features/data-table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@binspire/ui/components/dropdown-menu";
import { Button } from "@binspire/ui/components/button";
import { Ellipsis } from "lucide-react";
import PermittedActions from "@/features/permissions/permitted-actions";
import { usePermissionStore } from "@/store/permission-store";
import { auditColumns } from "./columns";
import { useDeleteBatchAudits, type Audit } from "@binspire/query";
import SelectedDataActions from "@/features/data-table/components/selected-data-actions";

export default function AuditDataTable({
  data,
  recentChangesMode,
}: {
  data: Audit[];
  recentChangesMode?: boolean;
}) {
  const { permission } = usePermissionStore();

  return (
    <DataTable
      data={data}
      columns={auditColumns}
      facetedFilterColumns={["entity", "action"]}
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
                type="activityManagement"
                actions={permission.activityManagement?.actions}
              />
            </DropdownMenuContent>
          </DropdownMenu>
        </>
      )}
      renderBatchActions={(selectedData, table) => {
        return (
          <SelectedDataActions<Audit>
            selectedData={selectedData}
            table={table}
            useDeleteBatchHook={useDeleteBatchAudits}
            actions={permission.activityManagement?.actions}
          />
        );
      }}
    />
  );
}
