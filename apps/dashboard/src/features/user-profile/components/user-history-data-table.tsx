import type { History as HistoryType } from "@binspire/query";
import { Button } from "@binspire/ui/components/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@binspire/ui/components/dropdown-menu";
import { Ellipsis } from "lucide-react";
import DataTable from "@/features/data-table";
import PermittedActions from "@/features/permissions/permitted-actions";
import { usePermissionStore } from "@/store/permission-store";
import { userHistoryColumns } from "./columns";

export default function UserHistoryDataTable({
  data,
}: {
  data: Omit<HistoryType, "user">[];
}) {
  const { permission } = usePermissionStore();

  return (
    <DataTable
      data={data}
      columns={userHistoryColumns}
      facetedFilterColumns={["entity"]}
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
              type="historyManagement"
              actions={permission.historyManagement?.actions}
            />
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    />
  );
}
