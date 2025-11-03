import { MessagingService } from "@/services";
import { factory } from "@/lib/factory";
import z from "zod";
import { zValidator } from "@/lib/utils";

export class MessagingHandler {
  private service = new MessagingService();

  registerFCM = factory.createHandlers(
    zValidator(
      "json",
      z.object({
        userId: z.string(),
        fcmToken: z.string(),
      }),
    ),
    async (c) => {
      const { userId, fcmToken } = c.req.valid("json");
      const data = await this.service.registerFCM(userId, fcmToken);

      return c.json(data, 200);
    },
  );

  sendNotification = factory.createHandlers(
    zValidator(
      "json",
      z.object({
        token: z.string(),
        notification: z.object({
          title: z.string(),
          body: z.string(),
        }),
        data: z.record(z.string(), z.string()).optional(),
      }),
    ),
    async (c) => {
      const { token, notification, data } = c.req.valid("json");
      await this.service.sendNotification(token, notification, data);

      return c.json({ message: "Notification sent successfully." }, 200);
    },
  );
}
