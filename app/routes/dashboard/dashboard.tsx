import { redirect } from "react-router";
import type { Route } from "./+types/dashboard";
import { destroySession, getSession } from "@/lib/sessions.server";
import db from "@/lib/db.server";
import { usersTable } from "@/db";
import { eq } from "drizzle-orm";
import DashboardMap from "@/components/map/dashboard-map";
import { createActivityLog } from "@/action/user.server";

export async function action({ request }: Route.ActionArgs) {
  const session = await getSession(request.headers.get("cookie"));
  const userId = session.get("userId");

  await db
    .update(usersTable)
    .set({
      isOnline: false,
    })
    .where(eq(usersTable.id, session.data.userId as string));

  await createActivityLog({
    userId: userId as string,
    action: "logout",
    status: "success",
    title: "authentication",
    description: "User logout successfully.",
  });

  return redirect("/login", {
    headers: {
      "Set-Cookie": await destroySession(session),
    },
  });
}

export default function DashboardPage() {
  return <DashboardMap />;
}
