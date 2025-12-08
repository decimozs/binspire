import { createFileRoute } from "@tanstack/react-router";
import MaintenanceScreen from "@/features/maintenance/components/maintenance-screen";

export const Route = createFileRoute("/maintenance/")({
  component: MaintenanceScreen,
});
