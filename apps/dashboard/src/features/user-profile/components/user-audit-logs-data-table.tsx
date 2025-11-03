import DataTable from "@/features/data-table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@binspire/ui/components/dropdown-menu";
import { Button } from "@binspire/ui/components/button";
import { Ellipsis } from "lucide-react";
import { usePermissionStore } from "@/store/permission-store";
import PermittedActions from "@/features/permissions/permitted-actions";
import { userAuditColumns } from "./columns";
import type { Audit } from "@binspire/query";

export default function UserAuditLogsDataTable({
  data,
}: {
  data: Omit<Audit, "user">[];
}) {
  const { permission } = usePermissionStore();

  return (
    <DataTable
      data={data}
      columns={userAuditColumns}
      facetedFilterColumns={["entity", "action"]}
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
              type="activityManagement"
              actions={permission.activityManagement?.actions}
            />
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    />
  );
}
