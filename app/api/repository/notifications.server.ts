import { userNotificationsTable } from "@/db";
import db from "@/lib/db.server";
import { eq } from "drizzle-orm";

function clearNotificationById(id: string) {
  return db
    .delete(userNotificationsTable)
    .where(eq(userNotificationsTable.id, id))
    .returning();
}

function clearAllNotifications(id: string) {
  return db
    .delete(userNotificationsTable)
    .where(eq(userNotificationsTable.userId, id))
    .returning();
}

function markAllNotificationsAsRead(id: string) {
  return db
    .update(userNotificationsTable)
    .set({
      status: "read",
    })
    .where(eq(userNotificationsTable.userId, id))
    .returning();
}

function markNotificationAsReadById(id: string) {
  return db
    .update(userNotificationsTable)
    .set({
      status: "read",
    })
    .where(eq(userNotificationsTable.id, id))
    .returning();
}

export const NotificationRepository = {
  clearNotificationById,
  clearAllNotifications,
  markAllNotificationsAsRead,
  markNotificationAsReadById,
};
