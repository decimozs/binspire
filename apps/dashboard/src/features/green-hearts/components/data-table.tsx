import SelectedDataActions from "@/features/data-table/components/selected-data-actions";
import { usePermissionStore } from "@/store/permission-store";
import {
  useBatchDeleteUserGreenHearts,
  type UserGreenHeart,
} from "@binspire/query";
import { greenHeartColumns } from "./columns";
import DataTable from "@/features/data-table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@binspire/ui/components/dropdown-menu";
import { Button } from "@binspire/ui/components/button";
import { Ellipsis } from "lucide-react";
import PermittedActions from "@/features/permissions/permitted-actions";

export default function GreenHeartsDataTable({
  data,
  recentChangesMode,
}: {
  data: UserGreenHeart[];
  recentChangesMode?: boolean;
}) {
  const { permission } = usePermissionStore();
  const sortedData = [...data].sort(
    (a, b) => (b.points ?? 0) - (a.points ?? 0),
  );

  return (
    <DataTable
      data={sortedData}
      columns={greenHeartColumns}
      facetedFilterColumns={[""]}
      recentChangesMode={recentChangesMode}
      renderActions={(item) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              disabled={
                permission.greenHeartsManagement?.actions.delete === false
              }
            >
              <Ellipsis />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <PermittedActions
              itemId={item.id}
              type="greenHeartsManagement"
              isUser={true}
              actions={permission.greenHeartsManagement?.actions}
            />
          </DropdownMenuContent>
        </DropdownMenu>
      )}
      renderBatchActions={(selectedData, table) => {
        return (
          <SelectedDataActions<UserGreenHeart>
            selectedData={selectedData}
            table={table}
            useDeleteBatchHook={useBatchDeleteUserGreenHearts}
            actions={permission.greenHeartsManagement?.actions}
          />
        );
      }}
    />
  );
}
