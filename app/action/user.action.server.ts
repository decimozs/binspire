import {
  userActivityTable,
  userCommentTable,
  userNotificationsTable,
  usersTable,
  type UpdateUser,
} from "@/db";
import db from "@/lib/db.server";
import { getSession } from "@/lib/sessions.server";
import type { CreateActivityLog, CreateNotification, Title } from "@/lib/types";
import { eq } from "drizzle-orm";
import { broadcast } from "@/lib/ws.server";
import { actionResponse } from "@/lib/utils";
import { rpc } from "@/lib/rpc";

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

  const latestNotification = await createUserNotification({
    userId: currentUser.data?.id as string,
    title: data.title,
    status: "unread",
    message: data.description,
    activityId: activityLog.id,
  });

  broadcast({
    transaction: "new-notification",
    userId: currentUser.data?.id as string,
    data: latestNotification.data,
  });

  broadcast({
    transaction: "action-made",
    userId: currentUser.data?.id as string,
  });

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

export async function deleteComment(commentId: string) {
  const [deletedComment] = await db
    .delete(userCommentTable)
    .where(eq(userCommentTable.id, commentId))
    .returning();

  if (!deletedComment) {
    return {
      errors: "Failed to delete comment",
    };
  }

  return deletedComment;
}

export async function clearNotificationById(notificationId: string) {
  const [response] = await db
    .delete(userNotificationsTable)
    .where(eq(userNotificationsTable.id, notificationId))
    .returning();

  if (!response) {
    return {
      errors: "Failed to clear notification",
    };
  }

  return {
    success: true,
  };
}

export async function clearAllNotifications(userId: string) {
  const [response] = await db
    .delete(userNotificationsTable)
    .where(eq(userNotificationsTable.userId, userId))
    .returning();

  if (!response) {
    return {
      errors: "Failed to clear all notifications",
    };
  }

  return {
    success: true,
  };
}

export async function markAllNotificationsAsRead(userId: string) {
  const [response] = await db
    .update(userNotificationsTable)
    .set({
      status: "read",
    })
    .where(eq(userNotificationsTable.userId, userId))
    .returning();

  console.log(response);

  if (!response) {
    return {
      errors: "Failed to mark all notifications as read",
    };
  }

  return {
    success: true,
  };
}

export async function markNotificationAsReadById(notificationId: string) {
  const [response] = await db
    .update(userNotificationsTable)
    .set({
      status: "read",
    })
    .where(eq(userNotificationsTable.id, notificationId))
    .returning();

  console.log(response);

  if (!response) {
    return {
      errors: "Failed to mark notification as read",
    };
  }

  return {
    success: true,
  };
}

async function updateUser(intent: string, id: string, data: UpdateUser) {
  try {
    await rpc.users[":id"].update.$patch({
      param: { id: id },
      json: data,
    });
    return actionResponse(true, intent);
  } catch (error) {
    return actionResponse(false, intent);
  }
}

export const UserAction = {
  updateUser,
};
