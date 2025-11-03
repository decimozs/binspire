import HelpCenter from "@/features/help-center";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_authenticated/help-center/")({
  component: RouteComponent,
});

function RouteComponent() {
  return <HelpCenter />;
}
