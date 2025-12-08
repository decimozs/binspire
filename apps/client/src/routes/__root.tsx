import type { QueryClient } from "@binspire/query";
import { useIsMobile } from "@binspire/ui/hooks/use-mobile";
import { createRootRouteWithContext, Outlet } from "@tanstack/react-router";
import LoaderLayout from "@/components/layout/loader-layout";
import { GeneralError } from "@/features/errors/general-error";
import { NotAvailable } from "@/features/errors/not-available";
import { NotFoundError } from "@/features/errors/not-found-error";
import { useNotifications } from "@/hooks/use-notifications";

interface RootContext {
  queryClient: QueryClient;
}

const RootLayout = () => {
  useNotifications();

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
