import RequestDemoForm from "@/components/forms/request-demo-form";
import AuthLayout from "@/components/layout/auth-layout";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/request-demo/")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <AuthLayout>
      <RequestDemoForm />
    </AuthLayout>
  );
}
