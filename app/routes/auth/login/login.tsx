import { useActionData, useLoaderData } from "react-router";
import type { Route } from "./+types/login";
import { login } from "@/action/auth.action.server";
import LoginForm from "./_components/form";

export async function loader({ request }: Route.LoaderArgs) {
  const url = new URL(request.url);
  const searchParams = new URLSearchParams(url.searchParams);
  const error = searchParams.get("e") ?? null;

  return {
    error,
  };
}

export async function action({ request }: Route.ActionArgs) {
  return await login(request);
}

export default function LoginPage() {
  const actionData = useActionData<typeof action>();
  const { error } = useLoaderData<typeof loader>();

  return <LoginForm actionErrors={actionData?.errors} loaderError={error} />;
}
