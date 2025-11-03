import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/maintenance/")({
  component: RouteComponent,
});

function RouteComponent() {
  return <div>Hello "/maintenance/"!</div>;
}
