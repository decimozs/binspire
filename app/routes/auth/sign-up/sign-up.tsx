import { useActionData, useLoaderData } from "react-router";
import type { Route } from "./+types/sign-up";
import { signUpLoader } from "@/loader/auth.server";
import { signUp } from "@/action/auth.server";
import SignUpForm from "./_components/form";

export async function loader({ request }: Route.LoaderArgs) {
  return await signUpLoader(request);
}

export async function action({ request }: Route.ActionArgs) {
  return await signUp(request);
}

export default function SignUpPage() {
  const actionData = useActionData<typeof action>();
  const { user, orgId, permission } = useLoaderData<typeof loader>();

  console.log("sign up page: ", {
    user,
    orgId,
    permission,
  });

  return (
    <SignUpForm
      actionErrors={actionData?.errors}
      user={user}
      orgId={orgId}
      permission={permission}
    />
  );
}
