import { type UserRequest, useDeleteBatchUserRequests } from "@binspire/query";
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
import { userRequestColumns } from "./columns";

export default function UserRequestsDataTable({
  data,
  recentChangesMode,
}: {
  data: UserRequest[];
  recentChangesMode?: boolean;
}) {
  const { permission } = usePermissionStore();

  return (
    <DataTable
      data={data}
      columns={userRequestColumns}
      facetedFilterColumns={["status", "type"]}
      recentChangesMode={recentChangesMode}
      analytics
      analyticsLink="/analytics/requests"
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
              type="accessRequestsManagement"
              actions={permission.accessRequestsManagement?.actions}
            />
          </DropdownMenuContent>
        </DropdownMenu>
      )}
      renderBatchActions={(selectedData, table) => {
        return (
          <SelectedDataActions<UserRequest>
            selectedData={selectedData}
            table={table}
            useDeleteBatchHook={useDeleteBatchUserRequests}
            actions={permission.accessRequestsManagement?.actions}
          />
        );
      }}
    />
  );
}
