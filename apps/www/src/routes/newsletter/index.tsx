import { createFileRoute } from "@tanstack/react-router";
import NewsLetterForm from "@/components/forms/newsletter-form";
import AuthLayout from "@/components/layout/auth-layout";

export const Route = createFileRoute("/newsletter/")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <AuthLayout>
      <NewsLetterForm />
    </AuthLayout>
  );
}
