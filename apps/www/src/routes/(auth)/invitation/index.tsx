import { createFileRoute, redirect } from "@tanstack/react-router";
import AuthLayout from "@/components/layout/auth-layout";
import z from "zod";
import { UserInvitationsApi } from "@binspire/query";
import InvitationForm from "@/components/forms/invitation-form";
import { decryptId } from "@/features/encryption";

const routeSchema = z.object({
  id: z.string().min(1, "Invitation ID is required"),
  token: z.string().min(1, "Token is required"),
});

export const Route = createFileRoute("/(auth)/invitation/")({
  component: RouteComponent,
  validateSearch: routeSchema,
  loaderDeps: ({ search: { id, token } }) => ({ id, token }),
  loader: async ({ deps: { id, token } }) => {
    if (!id || !token) {
      throw redirect({ to: "/" });
    }

    const decryptedId = await decryptId(id);
    const decryptedToken = await decryptId(token);
    const invitation = await UserInvitationsApi.getById(decryptedId);

    if (!invitation) throw redirect({ to: "/" });

    if (invitation.status === "confirmed") {
      throw redirect({
        to: "/register",
        search: { id, token },
      });
    }

    return {
      invitation,
      decryptedToken,
      rawCredentials: { id, token },
    };
  },
});

function RouteComponent() {
  const { invitation, decryptedToken, rawCredentials } = Route.useLoaderData();

  return (
    <AuthLayout>
      <InvitationForm
        invitationId={invitation.id}
        email={invitation.email}
        token={decryptedToken}
        rawCredentials={rawCredentials}
      />
    </AuthLayout>
  );
}
