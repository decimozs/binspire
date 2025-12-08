import { createFileRoute } from "@tanstack/react-router";
import LoaderLayout from "@/components/layout/loader-layout";
import Services from "@/features/services";

export const Route = createFileRoute("/_authenticated/services/")({
  component: RouteComponent,
  pendingComponent: LoaderLayout,
});

function RouteComponent() {
  return <Services />;
}
