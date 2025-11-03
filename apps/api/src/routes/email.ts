import { EmailHandler } from "@/handlers";
import { factory } from "@/lib/factory";

const handler = new EmailHandler();

export const emailRoutes = factory
  .createApp()
  .post("/send", ...handler.sendEmail)
  .post("/send-invitation", ...handler.sendInvitationEmail)
  .post("/send-request-demo", ...handler.sendRequestDemoEmail)
  .post("/send-newsletter", ...handler.sendNewsletterEmail);
