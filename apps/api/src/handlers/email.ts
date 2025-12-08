import z from "zod";
import { factory } from "@/lib/factory";
import { zValidator } from "@/lib/utils";
import { EmailService, sendEmailSchema } from "@/services";

export class EmailHandler {
  private service = new EmailService();

  sendEmail = factory.createHandlers(
    zValidator("json", sendEmailSchema),
    async (c) => {
      const payload = c.req.valid("json");
      const info = await this.service.sendEmail(payload);

      return c.json(info, 200);
    },
  );

  sendRequestDemoEmail = factory.createHandlers(
    zValidator("json", z.object({ email: z.email() })),
    async (c) => {
      const payload = c.req.valid("json");
      const info = await this.service.sendRequestDemoEmail(payload.email);

      return c.json(info, 200);
    },
  );

  sendNewsletterEmail = factory.createHandlers(
    zValidator("json", z.object({ email: z.email() })),
    async (c) => {
      const payload = c.req.valid("json");
      const info = await this.service.sendNewsletterEmail(payload.email);

      return c.json(info, 200);
    },
  );

  sendInvitationEmail = factory.createHandlers(
    zValidator(
      "json",
      z.object({ email: z.email(), role: z.string(), permission: z.string() }),
    ),
    async (c) => {
      const payload = c.req.valid("json");
      const orgId = c.get("user")?.orgId;
      const userId = c.get("user")?.id!;

      if (!orgId) {
        return c.json({ message: "Organization ID is missing." }, 400);
      }

      const info = await this.service.sendInvitationEmail(
        orgId,
        payload,
        userId,
      );

      return c.json(info, 200);
    },
  );
}
