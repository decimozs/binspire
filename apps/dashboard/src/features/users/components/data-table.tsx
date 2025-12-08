import { type User, useDeleteBatchUsers } from "@binspire/query";
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
import { userColumns } from "./columns";

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
      analytics
      analyticsLink="/analytics/users"
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
