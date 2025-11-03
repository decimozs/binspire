import LoaderLayout from "@/components/layout/loader-layout";
import Account from "@/features/account";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_authenticated/account/")({
  component: RouteComponent,
  pendingComponent: LoaderLayout,
});

function RouteComponent() {
  return <Account />;
}
