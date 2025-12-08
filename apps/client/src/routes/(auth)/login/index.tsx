import { createFileRoute, redirect } from "@tanstack/react-router";
import AuthLayout from "@/components/layout/auth-layout";
import { authClient } from "@/features/auth";
import LoginForm from "@/features/auth/component/login-form";

export const Route = createFileRoute("/(auth)/login/")({
  component: RouteComponent,
  beforeLoad: async () => {
    const { data: current } = await authClient.getSession();

    if (!current?.session) return;

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
