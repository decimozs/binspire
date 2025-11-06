import Welcome from "@/components/welcome";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/welcome/")({
  component: RouteComponent,
});

function RouteComponent() {
  return <Welcome />;
}
