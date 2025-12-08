import { createFileRoute } from "@tanstack/react-router";
import BackupSettings from "@/features/settings/components/backup";

export const Route = createFileRoute("/_authenticated/settings/(pages)/backup")(
  {
    component: BackupSettings,
  },
);
