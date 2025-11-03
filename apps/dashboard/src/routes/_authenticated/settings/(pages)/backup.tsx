import BackupSettings from "@/features/settings/components/backup";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_authenticated/settings/(pages)/backup")({
  component: BackupSettings,
});
