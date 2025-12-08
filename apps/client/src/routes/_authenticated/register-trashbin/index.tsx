import { createFileRoute } from "@tanstack/react-router";
import RegisterTrashbin from "@/features/trashbin/register-trashbin";

export const Route = createFileRoute("/_authenticated/register-trashbin/")({
  component: RegisterTrashbin,
});
