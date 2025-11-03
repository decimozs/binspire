import RegisterTrashbin from "@/features/trashbin/register-trashbin";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_authenticated/register-trashbin/")({
  component: RegisterTrashbin,
});
