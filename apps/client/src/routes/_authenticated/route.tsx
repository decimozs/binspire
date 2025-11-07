import Header from "@/components/header";
import Nav from "@/components/nav";
import { authClient } from "@/features/auth";
import { GeneralError } from "@/features/errors/general-error";
import { NotFoundError } from "@/features/errors/not-found-error";
import { MaintenanceApi, UserQuotaApi } from "@binspire/query";
import {
  createFileRoute,
  Outlet,
  redirect,
  useNavigate,
  useRouterState,
} from "@tanstack/react-router";
import { useEffect } from "react";

export const Route = createFileRoute("/_authenticated")({
  component: RouteComponent,
  beforeLoad: async () => {
    const { data: currentSession } = await authClient.getSession();

    if (!currentSession) {
      throw redirect({ to: "/login" });
    }

    const maintenance = await MaintenanceApi.getById(currentSession.user.orgId);

    const isMaintenance = maintenance.isInMaintenance;

    if (isMaintenance) {
      throw redirect({ to: "/maintenance" });
    }

    const today = new Date().toDateString();
    const lastResetDate = localStorage.getItem("lastQuotaResetDate");

    if (lastResetDate !== today) {
      await UserQuotaApi.update(currentSession.user.id, { used: 0 });
      localStorage.setItem("lastQuotaResetDate", today);
    }
  },
  notFoundComponent: NotFoundError,
  errorComponent: GeneralError,
});

function RouteComponent() {
  const navigate = useNavigate();
  const route = useRouterState();

  useEffect(() => {
    const hasDismissed = localStorage.getItem(
      "client_welcome_banner_dismissed",
    );
    const currentPath = route.location.pathname;

    if (!hasDismissed && currentPath !== "/welcome") {
      navigate({ to: "/welcome" });
    }
  }, [navigate, route.location.pathname]);

  return (
    <>
      <Header />
      <div className="px-6 pb-4 mt-4">
        <Outlet />
      </div>
      <Nav />
    </>
  );
}
