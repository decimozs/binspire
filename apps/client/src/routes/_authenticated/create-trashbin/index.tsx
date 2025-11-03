import CreateTrashbin from "@/features/trashbin/create-trashbin";
import { QRCodeApi } from "@binspire/query";
import { createFileRoute, redirect } from "@tanstack/react-router";
import z from "zod";

const routeSchema = z.object({
  secret: z.string().min(1, "Secret is required"),
});

export const Route = createFileRoute("/_authenticated/create-trashbin/")({
  component: RouteComponent,
  validateSearch: routeSchema,
  beforeLoad: async ({ search }) => {
    const secret = search.secret;

    if (!secret) throw redirect({ to: "/register-trashbin" });

    const verifyQrCode = await QRCodeApi.getBySecret(secret);

    if (
      !verifyQrCode ||
      ("status" in verifyQrCode && verifyQrCode.status === false)
    ) {
      throw redirect({ to: "/register-trashbin" });
    }
  },
});

function RouteComponent() {
  const { secret } = Route.useSearch();

  return <CreateTrashbin secret={secret} />;
}
