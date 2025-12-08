import {
  type UserInvitation,
  useDeleteBatchUserInvitations,
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
import { userInvitationColumns } from "./columns";

export default function UserInvitationsDataTable({
  data,
  recentChangesMode,
}: {
  data: UserInvitation[];
  recentChangesMode?: boolean;
}) {
  const { permission } = usePermissionStore();

  return (
    <DataTable
      data={data}
      columns={userInvitationColumns}
      facetedFilterColumns={["status"]}
      recentChangesMode={recentChangesMode}
      analytics
      analyticsLink="/analytics/invitations"
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
              type="invitationsManagement"
              actions={permission.invitationsManagement?.actions}
            />
          </DropdownMenuContent>
        </DropdownMenu>
      )}
      renderBatchActions={(selectedData, table) => {
        return (
          <SelectedDataActions<UserInvitation>
            selectedData={selectedData}
            table={table}
            useDeleteBatchHook={useDeleteBatchUserInvitations}
            actions={permission.invitationsManagement?.actions}
          />
        );
      }}
    />
  );
}
