import { redirect, useLoaderData } from "react-router";
import type { Route } from "./+types/dashboard";
import { destroySession, getSession } from "@/lib/sessions.server";
import db from "@/lib/db.server";
import { usersTable } from "@/db";
import { eq } from "drizzle-orm";
import DashboardMap from "@/components/map/dashboard-map";
import { useEffect } from "react";
import { toast } from "sonner";

export async function loader({ request }: Route.LoaderArgs) {
  const session = await getSession(request.headers.get("cookie"));
  const userId = session.get("userId") as string;

  const user = await db.query.usersTable.findFirst({
    where: (table, { eq }) => eq(table.id, userId),
  });

  return {
    name: user?.name as string,
  };
}

export async function action({ request }: Route.ActionArgs) {
  const session = await getSession(request.headers.get("cookie"));
  const userId = session.get("userId") as string;

  await db
    .update(usersTable)
    .set({
      isOnline: false,
    })
    .where(eq(usersTable.id, userId));

  return redirect("/logout", {
    headers: {
      "Set-Cookie": await destroySession(session),
    },
  });
}

export default function DashboardPage() {
  const { name } = useLoaderData();

  useEffect(() => {
    const hasWelcomed = sessionStorage.getItem("hasWelcomed");

    if (!hasWelcomed) {
      toast.success(`Welcome back, ${name}!`);
      sessionStorage.setItem("hasWelcomed", "true");
    }
  }, []);

  return <DashboardMap />;
}
