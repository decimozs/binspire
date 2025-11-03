import GeneralSettings from "@/features/settings/components/general";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_authenticated/settings/")({
  component: GeneralSettings,
});
