import { useActionData } from "react-router";
import type { Route } from "./+types/reset-password";
import { resetPasswordLoader } from "@/loader/auth.server";
import { resetPassword } from "@/action/auth.server";
import ResetPasswordForm from "./_components/form";

export async function loader({ request }: Route.ActionArgs) {
  return await resetPasswordLoader(request);
}

export async function action({ request }: Route.ActionArgs) {
  return await resetPassword(request);
}

export default function ResetPasswordPage() {
  const actionData = useActionData<typeof action>();
  return (
    <ResetPasswordForm
      actionSuccess={actionData?.success}
      actionErrors={actionData?.errors}
    />
  );
}
