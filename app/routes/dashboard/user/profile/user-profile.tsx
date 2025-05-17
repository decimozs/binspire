import type { Route } from "./+types/user-profile";
import { useLoaderData } from "react-router";
import UserInfo from "../_components/user-info";
import { userActivityTable, userCommentTable, userReplyTable } from "@/db";
import db from "@/lib/db.server";
import { eq } from "drizzle-orm";
import { getSession } from "@/lib/sessions.server";
import { UserLoader } from "@/loader/users.loader.server";
import { broadcast } from "@/lib/ws.server";

export async function loader({ params }: Route.LoaderArgs) {
  const userId = params.userId;
  return await UserLoader.profile(userId);
}

export async function action({ request }: Route.ActionArgs) {
  const session = await getSession(request.headers.get("cookie"));
  const userId = session.get("userId");
  const formData = await request.formData();
  const intent = formData.get("intent");
  const comment = formData.get("comment");
  const reply = formData.get("reply");
  const activityId = formData.get("activityId");
  const commentId = formData.get("commentId");
  const replyId = formData.get("replyId");

  if (intent === "delete-comment") {
    await db
      .delete(userCommentTable)
      .where(eq(userCommentTable.id, commentId as string));

    broadcast({
      transaction: "delete-comment",
    });

    return {
      success: true,
      intent: intent,
    };
  }

  if (intent === "delete-reply") {
    await db
      .delete(userReplyTable)
      .where(eq(userReplyTable.id, replyId as string));

    broadcast({
      transaction: "delete-reply",
    });

    return {
      success: true,
      intent: intent,
    };
  }

  if (intent === "reply" || intent === "new-reply") {
    const comentUserId = await db.query.userCommentTable.findFirst({
      where: (table, { eq }) => eq(table.id, commentId as string),
    });

    await db.insert(userReplyTable).values({
      commentId: commentId as string,
      userId: userId as string,
      message: reply as string,
      commentUserId: comentUserId?.userId as string,
    });

    broadcast({
      transaction: "new-reply",
    });

    return {
      success: true,
      intent: intent,
      commentId: commentId,
    };
  }

  if (intent === "comment") {
    const [newComment] = await db
      .insert(userCommentTable)
      .values({
        activityId: activityId as string,
        userId: userId as string,
        message: comment as string,
      })
      .returning();

    broadcast({
      transaction: "new-comment",
      data: newComment,
    });

    return {
      success: true,
      intent: intent,
    };
  }

  if (intent === "delete") {
    const [deleteActivity] = await db
      .delete(userActivityTable)
      .where(eq(userActivityTable.id, activityId as string))
      .returning();

    if (!deleteActivity) {
      return {
        errors: "Failed to delete user activity",
      };
    }

    return {
      success: true,
      intent: intent,
    };
  }
}

export default function UserProfileRoute() {
  const { user, activityLogs } = useLoaderData<typeof loader>();
  return <UserInfo data={activityLogs} user={user} />;
}
