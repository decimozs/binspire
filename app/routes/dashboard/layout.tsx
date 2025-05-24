import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { DashboardSidebar } from "@/components/sidebar/dashboard-sidebar";
import {
  Outlet,
  useLoaderData,
  useRevalidator,
  useRouteLoaderData,
} from "react-router";
import type { Route } from "./+types/layout";
import { getSession } from "@/lib/sessions.server";
import db from "@/lib/db.server";
import DynamicBreadcrumbs from "@/components/shared/dynamic-breadcrumbs";
import CommandCentralMenu from "@/components/shared/shortcut-menu";
import {
  getNotifications,
  getOnlineAdmins,
  getOnlineCollectors,
} from "@/query/users.query.server";
import type { User } from "@/lib/types";
import NotificationButton from "@/components/shared/notification-button";
import useAction from "@/hooks/use-action";
import { useEffect } from "react";
import { toast } from "sonner";
import { Command } from "lucide-react";
import { UserLoader } from "@/loader/users.loader.server";
import ReviewTrashbin from "@/components/map/review-trashbin";
import Filtering from "@/components/shared/filtering";
import ReviewTrashbinIssue from "./trashbin/_components/review-trashbin-issue";

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

  const username = profile?.name;

  const user = await db.query.usersTable.findFirst({
    where: (table, { eq }) => eq(table.id, userId),
  });

  const currentUser = user?.name;
  const onlineAdmins = await getOnlineAdmins();
  const onlineCollectors = await getOnlineCollectors();
  const baseNotifications = await getNotifications();
  const initialNotifications = baseNotifications.filter(
    (item) => item.userId !== userId,
  );

  const initalComments = await UserLoader.comments();

  return {
    user,
    username,
    currentUser,
    userId,
    onlineAdmins,
    onlineCollectors,
    initialNotifications,
    initalComments,
  };
}

export function useDashboardLayoutLoader() {
  return useRouteLoaderData<typeof loader>("routes/dashboard/layout");
}

export default function DashboardLayoutRoute() {
  const { user, username, userId } = useLoaderData<typeof loader>();
  const { actionMade, resetActionMade } = useAction();
  const revalidator = useRevalidator();

  useEffect(() => {
    if (actionMade >= 3) {
      toast("Table updated", {
        position: "bottom-center",
        action: {
          label: "Refresh",
          onClick: () => {
            resetActionMade();
            revalidator.revalidate();
          },
        },
      });
    }
  }, [actionMade]);

  return (
    <SidebarProvider>
      <DashboardSidebar userId={userId} user={user as User} />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
          <div className="flex items-center gap-2 px-4 w-full">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <DynamicBreadcrumbs username={username} />
            <CommandCentralMenu />
            <div className="flex flex-row items-center text-muted-foreground gap-3">
              <div className="flex flex-row items-center gap-1 text-muted-foreground border-input border-dashed border-[1px] rounded-sm p-1 px-2 font-medium text-[0.8rem]">
                <p>CTRL</p>
                <p>+</p>
                <p>K</p>
              </div>
              <div>
                <Command size={15} />
              </div>
            </div>
            <NotificationButton />
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
          <Outlet />
        </div>
        <ReviewTrashbin />
        <ReviewTrashbinIssue />
        <Filtering />
      </SidebarInset>
    </SidebarProvider>
  );
}
