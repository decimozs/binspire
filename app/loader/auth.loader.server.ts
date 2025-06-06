import db from "@/lib/db.server";
import type { VerificationType } from "@/lib/types";
import { eq } from "drizzle-orm";
import { redirect } from "react-router";

export async function verificationLoader(request: Request) {
  const url = new URL(request.url);
  const searchParams = new URLSearchParams(url.search);
  const type = searchParams.get("type") as VerificationType;

  if (!type || !["email-verification", "forgot-password"].includes(type)) {
    return redirect("/login");
  }

  return type;
}

export async function resetPasswordLoader(request: Request) {
  const url = new URL(request.url);
  const searchParams = new URLSearchParams(url.searchParams);
  const email = searchParams.get("e") as string;
  const token = searchParams.get("t") as string;

  if (!email || !token) {
    return redirect("/login");
  }

  const user = await db.query.usersTable.findFirst({
    where: (table, { eq }) => eq(table.email, email),
  });

  const verification = await db.query.verificationsTable.findFirst({
    where: (table, { and }) =>
      and(eq(table.value, token), eq(table.identifier, "forgot-password")),
  });

  if (!user || !verification) {
    return redirect("/login");
  }
}

export async function signUpLoader(request: Request) {
  const url = new URL(request.url);
  const searchParams = new URLSearchParams(url.searchParams);
  const id = searchParams.get("id");
  const token = searchParams.get("t");
  const orgId = searchParams.get("o");
  const permission = searchParams.get("p");

  if (!id || !token || !orgId || !permission) {
    return redirect("/login");
  }

  const user = await db.query.requestAccessTable.findFirst({
    where: (table, { eq }) => eq(table.id, id),
  });

  const verification = await db.query.verificationsTable.findFirst({
    where: (table, { eq }) => eq(table.value, token),
  });

  const organization = await db.query.organizationsTable.findFirst({
    where: (table, { eq }) => eq(table.id, orgId),
  });

  if (
    !verification ||
    !user ||
    !organization ||
    !["viewer", "editor", "full-access"].includes(permission)
  ) {
    return redirect("/login");
  }

  console.log("sign up payload: ", {
    user,
    orgId,
    permission,
  });

  return { user, orgId, permission };
}
