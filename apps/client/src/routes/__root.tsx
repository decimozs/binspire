import {
  createRootRouteWithContext,
  Outlet,
  useNavigate,
  useRouterState,
} from "@tanstack/react-router";
import { NotFoundError } from "@/features/errors/not-found-error";
import { GeneralError } from "@/features/errors/general-error";
import { QueryClient } from "@binspire/query";
import { useIsMobile } from "@binspire/ui/hooks/use-mobile";
import { NotAvailable } from "@/features/errors/not-available";
import LoaderLayout from "@/components/layout/loader-layout";
import { useFCMToken } from "@/hooks/use-fcm-token";
import { useNotifications } from "@/hooks/use-notifications";
import { useEffect } from "react";

interface RootContext {
  queryClient: QueryClient;
}

const RootLayout = () => {
  useNotifications();
  useFCMToken();
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

  const isSmallScreen = useIsMobile(1024);

  if (!isSmallScreen) {
    return (
      <NotAvailable
        message="This page is optimized for smaller screens.
          Please use a mobile or tablet device to access it."
      />
    );
  }

  return <Outlet />;
};

export const Route = createRootRouteWithContext<RootContext>()({
  component: RootLayout,
  notFoundComponent: NotFoundError,
  errorComponent: GeneralError,
  pendingComponent: LoaderLayout,
});
