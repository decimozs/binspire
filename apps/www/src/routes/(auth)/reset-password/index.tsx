import ResetPasswordForm from "@/components/forms/reset-password-form";
import AuthLayout from "@/components/layout/auth-layout";
import { VerificationApi } from "@binspire/query";
import { createFileRoute, redirect } from "@tanstack/react-router";
import z from "zod";

const routeSchema = z.object({
  token: z.string().min(1, "Token is required"),
});

export const Route = createFileRoute("/(auth)/reset-password/")({
  component: RouteComponent,
  validateSearch: routeSchema,
  beforeLoad: async ({ search }) => {
    const token = search.token;

    if (!token) throw redirect({ to: "/forgot-password" });

    const verifyToken = await VerificationApi.verifyIdentifier(
      `reset-password:${token}`,
    );

    if (!verifyToken) {
      throw redirect({ to: "/forgot-password" });
    }

    return { token };
  },
});

function RouteComponent() {
  const { token } = Route.useSearch();

  return (
    <AuthLayout>
      <ResetPasswordForm token={token} />
    </AuthLayout>
  );
}
