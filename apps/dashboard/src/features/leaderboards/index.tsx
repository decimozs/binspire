import type { User, UserGreenHeart } from "@binspire/query";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@binspire/ui/components/empty";
import { Trophy } from "lucide-react";
import { parseAsString, useQueryState } from "nuqs";
import MainLayout from "@/components/layout/main-layout";
import { usePermissionStore } from "@/store/permission-store";
import InviteUserButton from "../data-table/components/invite-user-button";
import RequestAccess from "../permissions/components/request-access";
import TopGreenHeartsDonatorDataTable, {
  TopAdminsDataTable,
  TopMaintenanceDataTable,
} from "./components/data-table";

interface Props {
  data: User[];
  greenHearts: UserGreenHeart[];
}

export default function Leaderboards({ data, greenHearts }: Props) {
  const { permission } = usePermissionStore();
  const [leaderboards] = useQueryState(
    "most_performant",
    parseAsString.withDefault("top_admins"),
  );

  if (data.length === 1 || data.length === 0) {
    return (
      <main className="flex items-center justify-center h-[80vh] w-full">
        <Empty>
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <Trophy />
            </EmptyMedia>
            <EmptyTitle>Leaderboard is empty</EmptyTitle>
            <EmptyDescription>
              There are no rankings available right now. Invite users to
              participate and track their progress here.
            </EmptyDescription>
          </EmptyHeader>
          <EmptyContent>
            <InviteUserButton />
          </EmptyContent>
        </Empty>
      </main>
    );
  }

  return (
    <>
      <RequestAccess actions={permission.userManagement?.actions} />
      <MainLayout
        title="Leaderboards"
        description="View the top users and their rankings within the application."
      >
        {leaderboards === "top_admins" && (
          <TopAdminsDataTable data={data} recentChangesMode={false} />
        )}
        {leaderboards === "top_maintenance" && (
          <TopMaintenanceDataTable data={data} recentChangesMode={false} />
        )}
        {leaderboards === "top_green_hearts" && (
          <TopGreenHeartsDonatorDataTable
            data={greenHearts}
            recentChangesMode={false}
          />
        )}
      </MainLayout>
    </>
  );
}
