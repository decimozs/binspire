import { requestAccessTable } from "@/db";
import db from "@/lib/db.server";
import type { Title } from "@/lib/types";
import { eq } from "drizzle-orm";
import { createUserActivityLog, getCurrentUser } from "./user.action.server";
import { fallbackInitials } from "@/lib/utils";

export async function getAllRequestAccess() {
  return await db.query.requestAccessTable.findMany();
}

export async function accessRequestAction(
  request: Request,
  requestId: string,
  intent: string,
  title: Title,
) {
  if (intent === "delete") {
    return await deleteRequest(request, requestId, intent, title);
  }
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

export async function deleteRequest(
  request: Request,
  requestId: string,
  intent: string,
  title: Title,
) {
  const [deletedRequest] = await db
    .delete(requestAccessTable)
    .where(eq(requestAccessTable.id, requestId))
    .returning();

  if (!deletedRequest) {
    return {
      errors: "Failed to delete request",
    };
  }

  const currentUser = await getCurrentUser(request);
  await createUserActivityLog(request, {
    userId: currentUser.data?.id as string,
    title: title,
    action: "delete",
    status: "success",
    description: `Access request of ${deletedRequest.name} has been deleted.`,
    content: {
      modifiedUserImage: `${fallbackInitials(deletedRequest.name) as string}`,
    },
  });

  return {
    success: true,
    intent: intent,
  };
}
