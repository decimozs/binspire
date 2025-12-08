import { createFileRoute } from "@tanstack/react-router";
import Welcome from "@/components/welcome";

export const Route = createFileRoute("/welcome/")({
  component: RouteComponent,
});

function RouteComponent() {
  return <Welcome />;
}
