import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { DashboardSidebar } from "@/components/sidebar/dashboard-sidebar";
import { Outlet, useLoaderData, useLocation, useNavigate } from "react-router";
import type { Route } from "./+types/layout";
import { getSession } from "@/lib/sessions.server";
import db from "@/lib/db.server";
import DynamicBreadcrumbs from "@/components/shared/dynamic-breadcrumbs";
import CommandCentralMenu from "@/components/shared/shortcut-menu";
import {
  getNotifications,
  getOnlineAdmins,
  getOnlineCollectors,
} from "@/query/users.server";
import type { User } from "@/lib/types";

export async function loader({ request }: Route.LoaderArgs) {
  const url = new URL(request.url);
  const session = await getSession(request.headers.get("cookie"));
  const userId = session.get("userId") as string;
  let profileId: string | null = null;

  const pathSegments = url.pathname.split("/");
  const profileIndex = pathSegments.indexOf("profile");

  if (profileIndex !== -1 && profileIndex + 1 < pathSegments.length) {
    profileId = pathSegments[profileIndex + 1];
  }

  const profile = await db.query.usersTable.findFirst({
    where: (table, { eq }) => eq(table.id, profileId as string),
  });

  const userName = profile?.name;

  const user = await db.query.usersTable.findFirst({
    where: (table, { eq }) => eq(table.id, userId),
  });

  const onlineAdmins = await getOnlineAdmins();
  const onlineCollectors = await getOnlineCollectors();
  const notifications = await getNotifications(request);

  return {
    user,
    userName,
    userId,
    onlineAdmins,
    onlineCollectors,
    notifications,
  };
}

export default function DashboardLayoutPage() {
  const {
    user,
    userName,
    userId,
    onlineAdmins,
    onlineCollectors,
    notifications,
  } = useLoaderData<typeof loader>();

  return (
    <SidebarProvider>
      <CommandCentralMenu />
      <DashboardSidebar
        userId={userId}
        onlineCollectors={onlineCollectors}
        onlineAdmins={onlineAdmins}
        user={user as User}
        notifications={notifications}
      />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
          <div className="flex items-center gap-2 px-4 w-full">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <DynamicBreadcrumbs userName={userName} />
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
          <Outlet />
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
