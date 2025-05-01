import { userActivityTable, userNotificationsTable, usersTable } from "@/db";
import db from "@/lib/db.server";
import { getSession } from "@/lib/sessions.server";
import type {
  Action,
  ActivityLog,
  CreateActivityLog,
  CreateNotification,
  Status,
  Title,
  User,
} from "@/lib/types";
import { eq } from "drizzle-orm";

export async function userAction(
  request: Request,
  userId: string,
  intent: string,
  title: Title,
  permissionData?: {
    currentPermission: string;
    updatedPermission: string;
  },
) {
  if (intent === "delete") {
    return await deleteUser(request, userId, intent, title);
  }

  if (intent === "update-user-permission") {
    return await updateUserPermission(
      request,
      userId,
      permissionData?.currentPermission as string,
      permissionData?.updatedPermission as string,
      intent,
      title,
    );
  }
}

export async function getCurrentUser(request: Request) {
  const session = await getSession(request.headers.get("cookie"));
  const userId = session.get("userId") as string;
  const user = await db.query.usersTable.findFirst({
    where: (table, { eq }) => eq(table.id, userId),
  });

  if (!user) {
    return {
      errors: "Failed to get current user.",
    };
  }

  return {
    data: user,
  };
}

export async function createUserActivityLog(
  request: Request,
  data: CreateActivityLog,
) {
  const { userId, ...items } = data;
  const currentUser = await getCurrentUser(request);

  const [activityLog] = await db
    .insert(userActivityTable)
    .values({
      userId: currentUser.data?.id as string,
      ...items,
    })
    .returning();

  if (!activityLog) {
    return {
      errors: "Failed to create user activity log",
    };
  }

  return {
    data: activityLog,
  };
}

export async function updateUserPermission(
  request: Request,
  userId: string,
  currentPermission: string,
  updatedPermission: string,
  intent: string,
  title: Title,
) {
  const [updatedUser] = await db
    .update(usersTable)
    .set({
      permission: updatedPermission,
    })
    .where(eq(usersTable.id, userId))
    .returning();

  if (!updatedUser) {
    return {
      errors: "Failed to update user permission",
    };
  }

  const currentUser = await getCurrentUser(request);

  const activity = await createUserActivityLog(request, {
    userId: currentUser.data?.id as string,
    title: title,
    action: "update",
    status: "success",
    description: `User ${updatedUser.name}'s permission has been updated from ${currentPermission} to ${updatedPermission}.`,
    content: {
      modifiedUserImage: updatedUser.image as string,
      currentPermission: currentPermission,
      updatedPermisson: updatedPermission,
    },
  });

  return {
    success: true,
    activityId: activity.data?.id as string,
    intent: intent,
  };
}

export async function deleteUser(
  request: Request,
  userId: string,
  intent: string,
  title: Title,
) {
  const [deletedUser] = await db
    .delete(usersTable)
    .where(eq(usersTable.id, userId))
    .returning();

  if (!deletedUser) {
    return {
      errors: "Failed to delete user",
    };
  }

  const currentUser = await getCurrentUser(request);
  const activity = await createUserActivityLog(request, {
    userId: currentUser.data?.id as string,
    title: title,
    action: "delete",
    status: "success",
    description: `Account of ${deletedUser.name} has been deleted.`,
    content: {
      modifiedUserImage: deletedUser.image as string,
    },
  });

  await createUserNotification({
    userId: currentUser.data?.id as string,
    title: title,
    status: "unread",
    message: "A user has been deleted.",
    activityId: activity.data?.id as string,
  });

  return {
    success: true,
    activityId: activity.data?.id as string,
    intent: intent,
  };
}

export async function createUserNotification(data: CreateNotification) {
  const [notification] = await db
    .insert(userNotificationsTable)
    .values(data)
    .returning();

  if (!notification) {
    return {
      errors: "Failed to create notification",
    };
  }

  return {
    data: notification,
  };
}
