import DataTable from "@/features/data-table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@binspire/ui/components/dropdown-menu";
import { userColumns } from "./columns";
import { Button } from "@binspire/ui/components/button";
import { Ellipsis } from "lucide-react";
import { usePermissionStore } from "@/store/permission-store";
import PermittedActions from "@/features/permissions/permitted-actions";
import { useDeleteBatchUsers, type User } from "@binspire/query";
import SelectedDataActions from "@/features/data-table/components/selected-data-actions";

export default function UsersDataTable({
  data,
  recentChangesMode,
}: {
  data: User[];
  recentChangesMode?: boolean;
}) {
  const { permission } = usePermissionStore();

  return (
    <DataTable
      data={data}
      columns={userColumns}
      facetedFilterColumns={["role"]}
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
              type="userManagement"
              isUser={true}
              actions={permission.userManagement?.actions}
            />
          </DropdownMenuContent>
        </DropdownMenu>
      )}
      renderBatchActions={(selectedData, table) => {
        return (
          <SelectedDataActions<User>
            selectedData={selectedData}
            table={table}
            useDeleteBatchHook={useDeleteBatchUsers}
            actions={permission.userManagement?.actions}
          />
        );
      }}
    />
  );
}
