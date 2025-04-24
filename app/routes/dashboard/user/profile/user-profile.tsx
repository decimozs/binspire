import type { Route } from "./+types/user-profile";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import { useLoaderData } from "react-router";
import UserInfo from "../_components/user-info";
import { userActivityTable, userCommentTable, userReplyTable } from "@/db";
import db from "@/lib/db.server";
import { eq } from "drizzle-orm";
import { getSession } from "@/lib/sessions.server";
import type { UserActivity } from "@/lib/types";

export async function loader({ params }: Route.LoaderArgs) {
  const userId = params.userId;
  const queryClient = new QueryClient();
  const { getUserById, getUserActivities } = await import(
    "@/query/users.server"
  );

  await queryClient.prefetchQuery({
    queryKey: ["user", userId],
    queryFn: () => getUserById(userId),
  });

  await queryClient.prefetchQuery({
    queryKey: ["user-activities", userId],
    queryFn: () => getUserActivities(userId),
  });

  return {
    dehydratedState: dehydrate(queryClient),
    getUserById: await getUserById(userId),
    getUserActivities: await getUserActivities(userId as string),
  };
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

    return {
      success: true,
      intent: intent,
    };
  }

  if (intent === "delete-reply") {
    await db
      .delete(userReplyTable)
      .where(eq(userReplyTable.id, replyId as string));

    return {
      success: true,
      intent: intent,
    };
  }

  if (intent === "reply" || intent === "new-reply") {
    await db.insert(userReplyTable).values({
      commentId: commentId as string,
      userId: userId as string,
      message: reply as string,
    });

    return {
      success: true,
      intent: intent,
      commentId: commentId,
    };
  }

  if (intent === "comment") {
    await db.insert(userCommentTable).values({
      activityId: activityId as string,
      userId: userId as string,
      message: comment as string,
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
  const { dehydratedState, getUserById, getUserActivities } =
    useLoaderData<typeof loader>();
  return (
    <HydrationBoundary state={dehydratedState}>
      <UserInfo
        user={getUserById}
        activity={getUserActivities as UserActivity[]}
      />
    </HydrationBoundary>
  );
}
