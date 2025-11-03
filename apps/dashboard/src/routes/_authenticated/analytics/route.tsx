import Analytics from "@/features/analytics";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_authenticated/analytics")({
  component: RouteComponent,
});

function RouteComponent() {
  return <Analytics />;
}
