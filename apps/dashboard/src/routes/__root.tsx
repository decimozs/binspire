import {
  createRootRouteWithContext,
  Outlet,
  useLocation,
} from "@tanstack/react-router";
import { NotFoundError } from "@/features/errors/not-found-error";
import { GeneralError } from "@/features/errors/general-error";
import NavigationProgress from "@/components/core/navigation-progress";
import { QueryClient } from "@binspire/query";
import { useIsMobile } from "@binspire/ui/hooks/use-mobile";
import { NotAvailable } from "@/features/errors/not-available";
import { useFCMToken } from "@/hooks/use-fcm-token";

interface RootContext {
  queryClient: QueryClient;
}

const RootLayout = () => {
  useFCMToken();

  const isMobile = useIsMobile();
  const isTablet = useIsMobile(1024);
  const { pathname } = useLocation();

  if (
    (isMobile && pathname !== "/live-updates") ||
    (isTablet && pathname !== "/live-updates")
  ) {
    return (
      <NotAvailable
        message="This page is optimized for larger screens.
          Please use a desktop device to access it."
      />
    );
  }

  return (
    <>
      <NavigationProgress />
      <Outlet />
    </>
  );
};

export const Route = createRootRouteWithContext<RootContext>()({
  component: RootLayout,
  notFoundComponent: NotFoundError,
  errorComponent: GeneralError,
});
