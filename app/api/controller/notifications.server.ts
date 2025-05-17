import { errorResponse, factory, successResponse } from "@/lib/utils";
import { NotificationsService } from "../service/notifications.server";
import { zValidator } from "@hono/zod-validator";
import { idParamSchema } from "@/lib/validations.server";

const clearNotificationById = factory.createHandlers(
  zValidator("param", idParamSchema),
  async (c) => {
    try {
      const { id } = c.req.valid("param");
      const response = await NotificationsService.clearNotificationById(id);
      return successResponse(c, response);
    } catch (error) {
      return errorResponse(c, error);
    }
  },
);

const clearAllNotifications = factory.createHandlers(
  zValidator("param", idParamSchema),
  async (c) => {
    try {
      const { id } = c.req.valid("param");
      const response = await NotificationsService.clearAllNotifications(id);
      return successResponse(c, response);
    } catch (error) {
      return errorResponse(c, error);
    }
  },
);

const markAllNotificationsAsRead = factory.createHandlers(
  zValidator("param", idParamSchema),
  async (c) => {
    try {
      const { id } = c.req.valid("param");
      const response =
        await NotificationsService.markAllNotificationsAsRead(id);
      return successResponse(c, response);
    } catch (error) {
      return errorResponse(c, error);
    }
  },
);

const markNotificationAsReadById = factory.createHandlers(
  zValidator("param", idParamSchema),
  async (c) => {
    try {
      const { id } = c.req.valid("param");
      const response =
        await NotificationsService.markNotificationAsReadById(id);
      return successResponse(c, response);
    } catch (error) {
      return errorResponse(c, error);
    }
  },
);

export const NotificationController = {
  clearNotificationById,
  clearAllNotifications,
  markAllNotificationsAsRead,
  markNotificationAsReadById,
};
