import { Form, useFetcher } from "react-router";
import { Button } from "~/components/ui/button";
import type { Route } from "./+types/request-access";

export async function action({ request }: Route.ActionArgs) {
  console.log("form submitted");

  await new Promise((resolve) => setTimeout(resolve, 2000));

  return null;
}

export default function RequestAccessPage() {
  const fetcher = useFetcher();

  return (
    <fetcher.Form method="POST">
      <Button type="submit">Request Access</Button>
      {fetcher.state === "submitting" && <p>Form is submitting</p>}
      {fetcher.state === "loading" && <p>form loading</p>}
    </fetcher.Form>
  );
}
