import MaintenanceScreen from "@/features/maintenance/components/maintenance-screen";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/maintenance/")({
  component: MaintenanceScreen,
});
