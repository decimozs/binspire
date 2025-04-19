import { redirect } from "react-router";
import type { Route } from "./+types/dashboard";
import { destroySession, getSession } from "@/lib/sessions.server";
import db from "@/lib/db.server";
import { usersTable } from "@/db";
import { eq } from "drizzle-orm";

export async function action({ request }: Route.ActionArgs) {
  const session = await getSession(request.headers.get("cookie"));

  console.log("session: ", session.data);

  await db
    .update(usersTable)
    .set({
      isOnline: false,
    })
    .where(eq(usersTable.id, session.data.userId as string));

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
