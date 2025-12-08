import { createFileRoute } from "@tanstack/react-router";
import Map from "@/features/map";

export const Route = createFileRoute("/_authenticated/map/")({
  component: RouteComponent,
});

function RouteComponent() {
  return <Map />;
}
