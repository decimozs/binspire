import AppearanceSettings from "@/features/settings/components/apperance";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute(
  "/_authenticated/settings/(pages)/appearance",
)({
  component: AppearanceSettings,
});
