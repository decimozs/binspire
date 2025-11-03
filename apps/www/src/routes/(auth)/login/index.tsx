import LoginForm from "@/components/forms/login-form";
import AuthLayout from "@/components/layout/auth-layout";
import { authClient } from "@/features/auth";
import { OrganizationApi, UserApi } from "@binspire/query";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/(auth)/login/")({
  component: RouteComponent,
  beforeLoad: async () => {
    const { data: current } = await authClient.getSession();

    if (!current?.session) return;

    const user = await UserApi.getById(current.user.id);

    if (user.status.role === "admin") {
      const org = await OrganizationApi.getById(user.orgId);

      window.location.href = `https://${org.slug}.binspire.space`;
    }
  },
});

function RouteComponent() {
  return (
    <AuthLayout>
      <LoginForm />
    </AuthLayout>
  );
}
