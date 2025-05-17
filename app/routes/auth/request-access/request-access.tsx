import { useActionData } from "react-router";
import type { Route } from "./+types/request-access";
import RequestAccessForm from "./_components/form";
import { requestAccess } from "@/action/auth.action.server";

export async function action({ request }: Route.ActionArgs) {
  return await requestAccess(request);
}

export default function RequestAccessPage() {
  const actionData = useActionData<typeof action>();
  return (
    <RequestAccessForm
      actionSuccess={actionData?.success}
      actionErrors={actionData?.errors}
    />
  );
}
