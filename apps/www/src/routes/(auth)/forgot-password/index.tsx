import { createFileRoute } from "@tanstack/react-router";
import RequestPasswordResetForm from "@/components/forms/request-password-reset-form";
import AuthLayout from "@/components/layout/auth-layout";

export const Route = createFileRoute("/(auth)/forgot-password/")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <AuthLayout>
      <RequestPasswordResetForm />
    </AuthLayout>
  );
}
