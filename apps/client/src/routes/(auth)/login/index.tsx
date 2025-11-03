import AuthLayout from "@/components/layout/auth-layout";
import { authClient } from "@/features/auth";
import LoginForm from "@/features/auth/component/login-form";
import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/(auth)/login/")({
  component: RouteComponent,
  beforeLoad: async () => {
    const { data: session } = await authClient.getSession();

    if (!session) return;

    throw redirect({
      to: "/",
    });
  },
});

function RouteComponent() {
  return (
    <AuthLayout>
      <LoginForm />
    </AuthLayout>
  );
}
