import { Button } from "@binspire/ui/components/button";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/download/")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <a href="/app-release.apk" download>
      <Button>Download Client</Button>
    </a>
  );
}
