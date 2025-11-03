import Map from "@/features/map";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_authenticated/map/")({
  component: RouteComponent,
});

function RouteComponent() {
  return <Map />;
}
