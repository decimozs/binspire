import LayoutButton from "@/components/core/layout-button";
import { Search } from "@/components/core/search";
import ThemeToggle from "@/components/core/toggle-theme";
import BinspireAI from "@/features/binspire-ai";
import Notification from "@/features/notification";
import Telemetry from "@/features/telemetry";
import { authClient } from "@/lib/auth-client";
import { useGetMaintenanceById } from "@binspire/query";
import { Separator } from "@binspire/ui/components/separator";
import { SidebarTrigger } from "@binspire/ui/components/sidebar";
import { Skeleton } from "@binspire/ui/components/skeleton";
import { useLocation } from "@tanstack/react-router";

export default function DashboardHeader() {
  const location = useLocation();
  const { data: session } = authClient.useSession();
  const maintenanceMode = useGetMaintenanceById(session?.user.orgId!);

  return (
    <header className="flex h-13 shrink-0 items-center gap-2 z-20">
      <div className="flex items-center gap-2 pr-4 justify-between w-full">
        <div className="flex items-center gap-2 px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator
            orientation="vertical"
            className="mr-2 data-[orientation=vertical]:h-4"
          />
          <p className="font-semibold">Overview</p>
          {maintenanceMode.isPending ? (
            <Skeleton className="h-5 w-30" />
          ) : (
            <div
              className={`flex flex-row items-center gap-2 font-bold text-xs px-3 py-1 rounded-md w-fit
      ${
        maintenanceMode.data?.isInMaintenance
          ? "bg-yellow-500/30 text-yellow-100"
          : location.pathname === "/map"
            ? "bg-green-500/30 text-green-100"
            : "green-badge"
      }`}
            >
              <span className="relative flex size-3">
                <span
                  className={`absolute inline-flex h-full w-full animate-ping rounded-full opacity-75 ${
                    maintenanceMode.data?.isInMaintenance
                      ? "bg-yellow-500"
                      : "bg-green-500"
                  }`}
                ></span>
                <span
                  className={`relative inline-flex size-3 rounded-full ${
                    maintenanceMode.data?.isInMaintenance
                      ? "bg-yellow-500"
                      : "bg-green-500"
                  }`}
                ></span>
              </span>
              <div>
                {maintenanceMode.data?.isInMaintenance
                  ? "Maintenance"
                  : "Operating"}
              </div>
            </div>
          )}
        </div>
        <div className="flex items-center gap-5">
          <Search />
          <div className="flex items-center gap-2">
            <LayoutButton />
            <ThemeToggle />
            <Telemetry />
            <BinspireAI />
            <Notification />
          </div>
        </div>
      </div>
    </header>
  );
}
