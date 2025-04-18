import type { Route } from "./+types/success-verification";
import { redirect, useLoaderData } from "react-router";
import db from "@/lib/db.server";
import { usersTable, verificationsTable } from "@/db";
import { and, eq } from "drizzle-orm";
import { useEffect } from "react";

export async function loader({ request }: Route.LoaderArgs) {
  const url = new URL(request.url);
  const searchParams = new URLSearchParams(url.search);
  const token = searchParams.get("t") as string;
  const email = searchParams.get("e") as string;
  const type = searchParams.get("tp") as string;

  const verification = await db.query.verificationsTable.findFirst({
    where: (table, { eq }) => eq(table.value, token),
  });

  const user = await db.query.usersTable.findFirst({
    where: (table, { eq }) => eq(table.email, email),
  });

  if (verification && type === "email-verification") {
    await db
      .delete(verificationsTable)
      .where(
        and(
          eq(verificationsTable.value, token),
          eq(verificationsTable.identifier, type),
        ),
      );

    await db
      .update(usersTable)
      .set({ emailVerified: true })
      .where(eq(usersTable.email, email));
  }

  if (!user) {
    await db
      .delete(verificationsTable)
      .where(
        and(
          eq(verificationsTable.value, token),
          eq(verificationsTable.identifier, type),
        ),
      );

    return redirect(
      `/verification-failed?e=${email}&t=${token}&tp=${type}&err=USER_NOT_FOUND`,
    );
  }

  if (user?.emailVerified === true && type === "email-verification") {
    await db
      .delete(verificationsTable)
      .where(
        and(
          eq(verificationsTable.value, token),
          eq(verificationsTable.identifier, type),
        ),
      );

    return redirect(
      `/verification-failed?e=${email}&t=${token}&tp=${type}&err=ALREADY_VERIFIED`,
    );
  }

  if (!verification) {
    return redirect(
      `/verification-failed?e=${email}&t=${token}&tp=${type}&err=INVALID_TOKEN`,
    );
  }

  return {
    email,
    type,
    token,
  };
}

export default function SuccessVerificationPage() {
  const loaderData = useLoaderData<typeof loader>();
  const email = loaderData.email;
  const token = loaderData.token;
  const type = loaderData.type;

  useEffect(() => {
    const channel = new BroadcastChannel("email-verification");
    channel.postMessage({
      type: "success",
      email,
      verificationType: type,
      token: token,
    });
    channel.close();
    window.close();
  }, []);

  return null;
}
