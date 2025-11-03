import DashboardLayout from "@/components/layout/dashboard-layout";
import { GeneralError } from "@/features/errors/general-error";
import { NotFoundError } from "@/features/errors/not-found-error";
import { authClient } from "@/lib/auth-client";
import { usePermissionStore } from "@/store/permission-store";
import { createFileRoute, redirect } from "@tanstack/react-router";
import {
  MaintenanceApi,
  OrganizationApi,
  OrganizationSettingsApi,
  UserStatusApi,
} from "@binspire/query";
import type { UserRole } from "@binspire/shared";
import { typeOfACL } from "@/lib/utils";

export const Route = createFileRoute("/_authenticated")({
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
  return <DashboardLayout />;
}
