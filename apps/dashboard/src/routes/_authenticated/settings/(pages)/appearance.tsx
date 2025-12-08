import { createFileRoute } from "@tanstack/react-router";
import AppearanceSettings from "@/features/settings/components/apperance";

export const Route = createFileRoute(
  "/_authenticated/settings/(pages)/appearance",
)({
  component: AppearanceSettings,
});
