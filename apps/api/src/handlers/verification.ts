import { insertVerificationSchema } from "@binspire/db/schema";
import z from "zod";
import { factory } from "@/lib/factory";
import { idParamSchema, zValidator } from "@/lib/utils";
import { VerificationService } from "@/services";

export default class VerificationHandler {
  private service = new VerificationService();

  verify = factory.createHandlers(
    zValidator("json", z.object({ value: z.string() })),
    async (c) => {
      const { value } = c.req.valid("json");
      const data = await this.service.verify(value);

      return c.json(data, 200);
    },
  );

  verifyIdentifier = factory.createHandlers(
    zValidator("json", z.object({ identifier: z.string() })),
    async (c) => {
      const { identifier } = c.req.valid("json");
      const data = await this.service.verifyIdentifier(identifier);

      return c.json(data, 200);
    },
  );

  create = factory.createHandlers(
    zValidator("json", insertVerificationSchema),
    async (c) => {
      const payload = c.req.valid("json");
      const data = await this.service.create(payload);

      return c.json(data, 200);
    },
  );

  delete = factory.createHandlers(
    zValidator("param", idParamSchema),
    async (c) => {
      const { id } = c.req.valid("param");
      const data = await this.service.delete(id);

      return c.json(data, 200);
    },
  );
}
