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
import { useEffect } from "react";
import { toast } from "sonner";
import DynamicBreadcrumbs from "@/components/shared/dynamic-breadcrumbs";
import CommandCentralMenu from "@/components/shared/shortcut-menu";

export async function loader({ request }: Route.LoaderArgs) {
  const url = new URL(request.url);
  const searchParams = new URLSearchParams(url.searchParams);
  const message = searchParams.get("m") ?? null;
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

  return { user, message, userName };
}

export default function DashboardLayoutPage() {
  const { user, message, userName } = useLoaderData<typeof loader>();
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <SidebarProvider>
      <CommandCentralMenu />
      <DashboardSidebar user={user} />
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
