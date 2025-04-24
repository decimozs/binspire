import { userActivityTable, userCommentTable, userReplyTable } from "@/db";
import db from "@/lib/db.server";
import { eq, isNotNull } from "drizzle-orm";

export async function getUsers() {
  return await db.query.usersTable.findMany();
}

export async function getUserById(id: string) {
  return await db.query.usersTable.findFirst({
    where: (table, { eq }) => eq(table.id, id),
  });
}

export async function getUsersRequestAccess() {
  return await db.query.requestAccessTable.findMany();
}

export async function getUserActivities(userId: string) {
  const result = await db.query.userActivityTable.findMany({
    where: eq(userActivityTable.userId, userId),
    with: {
      comments: {
        orderBy: (comments, { desc }) => [desc(comments.createdAt)],
        with: {
          user: {
            columns: {
              name: true,
              image: true,
            },
          },
          replies: {
            orderBy: (replies, { desc }) => [desc(replies.createdAt)],
            with: {
              user: {
                columns: {
                  name: true,
                  image: true,
                },
              },
            },
          },
        },
      },
    },
    orderBy: (activities, { desc }) => [desc(activities.createdAt)],
  });
  return result;
}

export async function getUserComments(activityId: string) {
  return await db
    .select()
    .from(userCommentTable)
    .where(eq(userCommentTable.activityId, activityId));
}
