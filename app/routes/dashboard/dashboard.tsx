import { redirect } from "react-router";
import type { Route } from "./+types/dashboard";
import { destroySession, getSession } from "@/lib/sessions.server";

export async function action({ request }: Route.ActionArgs) {
  const session = await getSession(request.headers.get("cookie"));
  return redirect("/login", {
    headers: {
      "Set-Cookie": await destroySession(session),
    },
  });
}

export default function DashboardPage() {
  return (
    <main>
      <div>DashboardPage</div>
    </main>
  );
}
