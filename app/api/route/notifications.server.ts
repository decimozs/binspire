import { NotificationController } from "../controller/notifications.server";
import { factory } from "@/lib/utils";

const notificationRoutes = factory
  .createApp()
  .delete(
    "/notifications/:id/clear",
    ...NotificationController.clearNotificationById,
  )
  .delete(
    "/notifications/:id/clear-all",
    ...NotificationController.clearAllNotifications,
  )
  .patch(
    "/notifications/:id/mark-all-as-read",
    ...NotificationController.markAllNotificationsAsRead,
  )
  .patch(
    "/notifications/:id/mark-as-read",
    ...NotificationController.markNotificationAsReadById,
  );

export default notificationRoutes;
