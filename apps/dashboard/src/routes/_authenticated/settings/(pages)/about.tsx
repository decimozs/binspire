import { createFileRoute } from "@tanstack/react-router";
import AboutSettings from "@/features/settings/components/about";

export const Route = createFileRoute("/_authenticated/settings/(pages)/about")({
  component: AboutSettings,
});
