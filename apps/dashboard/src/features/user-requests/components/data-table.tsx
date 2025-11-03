import DataTable from "@/features/data-table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@binspire/ui/components/dropdown-menu";
import { Button } from "@binspire/ui/components/button";
import { Ellipsis } from "lucide-react";
import { userRequestColumns } from "./columns";
import { usePermissionStore } from "@/store/permission-store";
import PermittedActions from "@/features/permissions/permitted-actions";
import { useDeleteBatchUserRequests, type UserRequest } from "@binspire/query";
import SelectedDataActions from "@/features/data-table/components/selected-data-actions";

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
