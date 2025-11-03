import AboutSettings from "@/features/settings/components/about";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_authenticated/settings/(pages)/about")({
  component: AboutSettings,
});
