import LayoutButton from "@/components/core/layout-button";
import { Search } from "@/components/core/search";
import ThemeToggle from "@/components/core/toggle-theme";
import BinspireAI from "@/features/binspire-ai";
import Notification from "@/features/notification";
import Telemetry from "@/features/telemetry";
import { authClient } from "@/lib/auth-client";
import { useMonitoringStore } from "@/store/monitoring-store";
import { useTrashbinRealtime } from "@/store/realtime-store";
import { useTelemetryStore } from "@/store/telemetry-store";
import { useGetMaintenanceById } from "@binspire/query";
import { Separator } from "@binspire/ui/components/separator";
import { SidebarTrigger } from "@binspire/ui/components/sidebar";
import { Skeleton } from "@binspire/ui/components/skeleton";
import { useLocation } from "@tanstack/react-router";
import { format } from "date-fns";
import { useEffect, useState } from "react";

export default function DashboardHeader() {
  const location = useLocation();
  const { data: session } = authClient.useSession();
  const maintenanceMode = useGetMaintenanceById(session?.user.orgId!);
  const { enabled } = useMonitoringStore();
  const isTelemetryConnected = useTelemetryStore((state) => state.isConnected);
  const realtimeTrashbins = useTrashbinRealtime((state) => state.bins);

  const hasValidConnection =
    isTelemetryConnected && Object.entries(realtimeTrashbins).length > 0;

  const [time, setTime] = useState(() =>
    format(new Date(), "EEEE, MMMM d • h:mm a"),
  );

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(format(new Date(), "EEEE, MMMM d • h:mm a"));
    }, 60000);
    return () => clearInterval(interval);
  }, []);

  if (enabled) {
    return (
      <>
        <div className="fixed top-4 left-4 flex flex-row items-center gap-2 z-20">
          <div className="z-20 flex flex-row items-center gap-2 font-bold text-xs px-3 py-1 rounded-md w-fit bg-orange-500/50 text-orange-100 shadow-sm">
            <p>Monitoring Mode</p>
          </div>

          {hasValidConnection ? (
            <div className="z-20 flex flex-row items-center gap-2 font-bold text-xs px-3 py-1 rounded-md w-fit bg-green-500/50 text-green-100 shadow-sm">
              <p>Connected</p>
            </div>
          ) : (
            <div className="z-20 flex flex-row items-center gap-2 font-bold text-xs px-3 py-1 rounded-md w-fit bg-red-500/50 text-red-100 shadow-sm">
              <p>Disonnected</p>
            </div>
          )}
        </div>

        <div className="fixed bottom-4 left-4 z-20 text-sm font-medium bg-background/80 backdrop-blur-sm px-3 py-2 rounded-md shadow-sm">
          {time}
        </div>
      </>
    );
  }

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
              className={`flex flex-row items-center gap-2 font-bold text-xs px-3 py-1 rounded-md w-fit shadow-sm
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
          <div className="ml-3 flex items-center gap-2">
            <LayoutButton />
            <ThemeToggle />
            <Telemetry />
            <Notification />
          </div>
          <BinspireAI />
        </div>
      </div>
    </header>
  );
}
