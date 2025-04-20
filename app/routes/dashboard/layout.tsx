import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
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
import DashboardBreadcrumbs from "@/components/shared/breadcrumbs";

export async function loader({ request }: Route.LoaderArgs) {
  const url = new URL(request.url);
  const searchParams = new URLSearchParams(url.searchParams);
  const message = searchParams.get("m") ?? null;
  const session = await getSession(request.headers.get("cookie"));
  const userId = session.get("userId") as string;

  const user = await db.query.usersTable.findFirst({
    where: (table, { eq }) => eq(table.id, userId),
  });

  return { user, message };
}

export default function DashboardLayoutPage() {
  const { user, message } = useLoaderData<typeof loader>();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (location.search || location.hash) {
      navigate(location.pathname, { replace: true });
    }

    if (message === "welcome") {
      toast.success(`Welcome back ${user?.name}!`);
    }
  }, [location, message, navigate, user?.name]);

  return (
    <SidebarProvider>
      <DashboardSidebar user={user} />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <DashboardBreadcrumbs />
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
          <Outlet />
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
