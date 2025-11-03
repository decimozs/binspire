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
import {
  topAdminsColumns,
  topGreenHeartDonatorColumns,
  topMaintenanceColumns,
} from "./columns";
import { type User, type UserGreenHeart } from "@binspire/query";

export function TopAdminsDataTable({
  data,
  recentChangesMode,
}: {
  data: User[];
  recentChangesMode?: boolean;
}) {
  const { permission } = usePermissionStore();

  const adminUsers = data.filter((user) => user.status?.role === "admin");

  const adminUsersWithContributionCounts = adminUsers.map((user) => ({
    ...user,
    contributionCounts: user.audits?.length || 0,
  }));

  const sortedData = adminUsersWithContributionCounts.sort(
    (a, b) => b.contributionCounts - a.contributionCounts,
  );

  return (
    <DataTable
      data={sortedData}
      columns={topAdminsColumns}
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
    />
  );
}

export function TopMaintenanceDataTable({
  data,
  recentChangesMode,
}: {
  data: User[];
  recentChangesMode?: boolean;
}) {
  const { permission } = usePermissionStore();

  const maintenanceUsers = data.filter(
    (user) => user.status?.role === "maintenance",
  );

  const maintenanceWithCollectionCount = maintenanceUsers.map((user) => ({
    ...user,
    collectionCount: user.collections?.length || 0,
  }));

  const sortedData = maintenanceWithCollectionCount.sort(
    (a, b) => b.collectionCount - a.collectionCount,
  );

  return (
    <DataTable
      data={sortedData}
      columns={topMaintenanceColumns}
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
    />
  );
}

export default function TopGreenHeartsDonatorDataTable({
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
      columns={topGreenHeartDonatorColumns}
      facetedFilterColumns={[""]}
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
              type="greenHeartsManagement"
              isUser={true}
              actions={permission.greenHeartsManagement?.actions}
            />
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    />
  );
}
