import { MessagingHandler } from "@/handlers/messaging";
import { factory } from "@/lib/factory";

const handler = new MessagingHandler();

export const messagingRoutes = factory
  .createApp()
  .post("/register", ...handler.registerFCM)
  .post("/send-notification", ...handler.sendNotification);
