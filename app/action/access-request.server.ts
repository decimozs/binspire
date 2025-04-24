import { requestAccessTable } from "@/db";
import db from "@/lib/db.server";
import { getSession } from "@/lib/sessions.server";
import { eq } from "drizzle-orm";

export async function accessRequest(request: Request) {
  const formData = await request.formData();
  const intent = formData.get("intent");
  const requestId = formData.get("requestId") as string;
  const email = formData.get("email") as string;
  const accessControl = formData.get("access-control") as string;
  const session = await getSession(request.headers.get("cookie"));
  const orgId = session.get("orgId") as string;
  let token;
  let type;
  let role;

  if (intent === "delete") {
    return await deleteRequest(intent, requestId);
  }

  if (intent === "approved" || intent === "rejected") {
    const result = await updateRequest(intent, requestId);
    token = result.token;
    type = result.type;
    role = result.role;
  }

  return {
    token,
    type,
    role,
    intent,
    requestId,
    email,
    accessControl,
    orgId,
  };
}

export async function updateRequest(intent: string, requestId: string) {
  const [user] = await db
    .update(requestAccessTable)
    .set({
      status: intent,
    })
    .where(eq(requestAccessTable.id, requestId))
    .returning();

  if (!user) {
    return {
      errors: `Failed to ${intent}. Request not found.`,
    };
  }

  const verificationId = user.verificationId;

  const verification = await db.query.verificationsTable.findFirst({
    where: (table, { eq }) => eq(table.id, verificationId),
  });

  if (!verification) {
    return {
      errors: "Failed to verify. Verification not found.",
    };
  }

  const role = user.role;
  const token = verification.value;
  const type = verification.identifier;

  return {
    role,
    token,
    type,
  };
}

export async function deleteRequest(intent: string, requestId: string) {
  const [action] = await db
    .delete(requestAccessTable)
    .where(eq(requestAccessTable.id, requestId))
    .returning();

  if (!action) {
    return {
      errors: "Failed to delete. Request not found.",
    };
  }

  return {
    success: true,
    intent: intent,
  };
}
