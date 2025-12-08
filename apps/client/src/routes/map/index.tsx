import { MaintenanceApi, UserApi } from "@binspire/query";
import { createFileRoute, redirect } from "@tanstack/react-router";
import { authClient } from "@/features/auth";
import { GeneralError } from "@/features/errors/general-error";
import { NotFoundError } from "@/features/errors/not-found-error";
import GlobalMap from "@/features/map";

export const Route = createFileRoute("/map/")({
  component: GlobalMap,
  beforeLoad: async () => {
    const { data: currentSession } = await authClient.getSession();

    if (!currentSession) {
      throw redirect({ to: "/login" });
    }

    const [user, maintenance] = await Promise.all([
      UserApi.getById(currentSession.user.id),
      MaintenanceApi.getById(currentSession.user.orgId),
    ]);

    if (user.status.role !== "maintenance") {
      throw redirect({ href: "https://www.binspire.space/login" });
    }

    const isMaintenance = maintenance.isInMaintenance;

    if (isMaintenance) {
      throw redirect({ to: "/maintenance" });
    }
  },
  notFoundComponent: NotFoundError,
  errorComponent: GeneralError,
});
