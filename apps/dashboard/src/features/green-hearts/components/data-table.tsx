import {
  type UserGreenHeart,
  useBatchDeleteUserGreenHearts,
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
import { greenHeartColumns } from "./columns";

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
      analytics
      analyticsLink="/analytics/green-hearts"
      renderActions={(item) =>
        permission.greenHeartsManagement?.actions.delete && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <Ellipsis />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <PermittedActions
                itemId={item.userId}
                type="greenHeartsManagement"
                isUser={true}
                actions={permission.greenHeartsManagement?.actions}
              />
            </DropdownMenuContent>
          </DropdownMenu>
        )
      }
      renderBatchActions={(selectedData, table) => (
        <SelectedDataActions<UserGreenHeart>
          selectedData={selectedData}
          table={table}
          useDeleteBatchHook={useBatchDeleteUserGreenHearts}
          actions={permission.greenHeartsManagement?.actions}
        />
      )}
    />
  );
}
