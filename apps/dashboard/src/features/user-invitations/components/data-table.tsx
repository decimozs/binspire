import DataTable from "@/features/data-table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@binspire/ui/components/dropdown-menu";
import { userInvitationColumns } from "./columns";
import { Button } from "@binspire/ui/components/button";
import { Ellipsis } from "lucide-react";
import { usePermissionStore } from "@/store/permission-store";
import PermittedActions from "@/features/permissions/permitted-actions";
import {
  useDeleteBatchUserInvitations,
  type UserInvitation,
} from "@binspire/query";
import SelectedDataActions from "@/features/data-table/components/selected-data-actions";

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
