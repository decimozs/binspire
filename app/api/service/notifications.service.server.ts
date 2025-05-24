import { NotificationRepository } from "../repository/notifications.repository.server";

async function clearNotificationById(id: string) {
  const [data] = await NotificationRepository.clearNotificationById(id);
  if (!data) throw new Error("Failed to clear notifications");
  return data;
}

async function clearAllNotifications(id: string) {
  const [data] = await NotificationRepository.clearAllNotifications(id);
  if (!data) throw new Error("Failed to clear all notifications");
  return data;
}

async function markAllNotificationsAsRead(id: string) {
  const [data] = await NotificationRepository.markAllNotificationsAsRead(id);
  if (!data) throw new Error("Failed to mark as read all notifications");
  return data;
}

async function markNotificationAsReadById(id: string) {
  const [data] = await NotificationRepository.markNotificationAsReadById(id);
  if (!data) throw new Error("Failed to mark as read notification");
  return data;
}

export const NotificationsService = {
  clearNotificationById,
  clearAllNotifications,
  markAllNotificationsAsRead,
  markNotificationAsReadById,
};
