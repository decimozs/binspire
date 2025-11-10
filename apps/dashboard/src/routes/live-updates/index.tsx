import { GeneralError } from "@/features/errors/general-error";
import { NotFoundError } from "@/features/errors/not-found-error";
import { authClient } from "@/lib/auth-client";
import { typeOfACL } from "@/lib/utils";
import { usePermissionStore } from "@/store/permission-store";
import {
  useRealtimeUpdatesStore,
  useTrashbinRealtime,
} from "@/store/realtime-store";
import { useTelemetryStore } from "@/store/telemetry-store";
import {
  MaintenanceApi,
  OrganizationApi,
  OrganizationSettingsApi,
  UserStatusApi,
} from "@binspire/query";
import type { UserRole } from "@binspire/shared";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@binspire/ui/components/empty";
import { ScrollArea } from "@binspire/ui/components/scroll-area";
import { createFileRoute, redirect } from "@tanstack/react-router";
import { formatDistanceToNow } from "date-fns";
import { Telescope } from "lucide-react";

export const Route = createFileRoute("/live-updates/")({
  component: RouteComponent,
  notFoundComponent: NotFoundError,
  errorComponent: GeneralError,
  beforeLoad: async () => {
    const { data: session } = await authClient.getSession();

    if (!session) {
      throw redirect({ href: "https://www.binspire.space/login" });
    }

    const currentUser = session.user;
    const [userStatus, maintenance, org, orgSettings] = await Promise.all([
      UserStatusApi.getByUserId(currentUser.id),
      MaintenanceApi.getById(currentUser.orgId),
      OrganizationApi.getById(currentUser.orgId),
      OrganizationSettingsApi.getByOrgId(currentUser.orgId),
    ]);

    const userRole = userStatus.role as UserRole;
    const isSuperuser = typeOfACL(userStatus.permission).allTrue;

    usePermissionStore.setState({
      permission: userStatus.permission,
      role: userRole,
      isSuperuser,
    });

    if (userRole === "maintenance") {
      throw redirect({ href: "https://www.binspire.space/login" });
    }

    if (maintenance.isInMaintenance && !isSuperuser) {
      throw redirect({ to: "/maintenance" });
    }

    if (import.meta.env.VITE_NODE_ENV === "production") {
      const url = new URL(window.location.href);
      const hostname = url.hostname;
      const orgSubdomain = hostname.split(".")[0];

      if (orgSubdomain !== org.slug) {
        throw redirect({ href: "/unauthorized" });
      }
    }

    if (!orgSettings.secret && typeof window !== "undefined") {
      const currentUrl = new URL(window.location.href);

      if (!currentUrl.searchParams.has("generate_secret")) {
        currentUrl.searchParams.set("generate_secret", "true");
        throw redirect({ href: currentUrl.toString() });
      }
    }
  },
});

function RouteComponent() {
  const updates = useRealtimeUpdatesStore((state) => state.updates);
  const isTelemetryConnected = useTelemetryStore((state) => state.isConnected);
  const realtimeTrashbins = useTrashbinRealtime((state) => state.bins);

  const hasValidConnection =
    isTelemetryConnected && Object.entries(realtimeTrashbins).length > 0;

  return (
    <main className="p-4">
      <div className="mb-4 flex flex-row items-center gap-2">
        <p className="text-xl font-bold">Live Updates</p>
        {hasValidConnection ? (
          <p className="green-badge">Connected</p>
        ) : (
          <p className="red-badge">Not connected</p>
        )}
      </div>

      {!hasValidConnection && (
        <div className="flex w-full h-[90vh] items-center justify-center">
          <Empty>
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <Telescope />
              </EmptyMedia>
              <EmptyTitle>No Live Updates Available</EmptyTitle>
              <EmptyDescription>
                Live updates will appear here once the telemetry system is
                connected and trashbins are active.
              </EmptyDescription>
            </EmptyHeader>
          </Empty>
        </div>
      )}

      {hasValidConnection && (
        <ScrollArea className="h-[90vh] pr-4">
          <div className="space-y-2">
            {updates.map((update, index) => (
              <div
                key={index}
                className="animate-fadeIn transition-all duration-700 bg-card p-4 rounded-md flex flex-col gap-1"
              >
                <p>{update.msg}</p>
                <p className="text-muted-foreground text-right text-sm">
                  {formatDistanceToNow(new Date(update.timestamp), {
                    addSuffix: true,
                  })}
                </p>
              </div>
            ))}
          </div>
        </ScrollArea>
      )}
    </main>
  );
}
