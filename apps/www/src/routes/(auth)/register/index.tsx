import { UserInvitationsApi } from "@binspire/query";
import { createFileRoute, redirect } from "@tanstack/react-router";
import z from "zod";
import RegisterForm from "@/components/forms/register-form";
import AuthLayout from "@/components/layout/auth-layout";
import { decryptId } from "@/features/encryption";

const routeSchema = z.object({
  id: z.string().min(1, "Invitation ID is required"),
  token: z.string().min(1, "Token is required"),
});

export const Route = createFileRoute("/(auth)/register/")({
  component: RouteComponent,
  validateSearch: routeSchema,
  loaderDeps: ({ search: { id, token } }) => ({ id, token }),
  loader: async ({ deps: { id } }) => {
    const decryptedId = await decryptId(id);
    const invitation = await UserInvitationsApi.getById(decryptedId);

    if (!invitation || invitation.status !== "confirmed")
      throw redirect({ to: "/" });

    return { invitation };
  },
});

function RouteComponent() {
  const { invitation } = Route.useLoaderData();

  return (
    <AuthLayout>
      <RegisterForm {...invitation} />
    </AuthLayout>
  );
}
