import { auth } from "@/features/auth";
import { factory } from "@/lib/factory";
import { insertQrCodeSchema, updateQrCodeSchema } from "@binspire/db/schema";
import { idParamSchema, zValidator } from "@/lib/utils";
import { QrCodeService } from "@/services";

export class AuthHandler {
  static betterAuth = factory.createHandlers(async (c) => {
    return auth.handler(c.req.raw);
  });
}

export class QrCodeHandler {
  private service = new QrCodeService();

  create = factory.createHandlers(
    zValidator("json", insertQrCodeSchema),
    async (c) => {
      const payload = c.req.valid("json");
      const data = await this.service.create(payload);

      return c.json(data, 201);
    },
  );

  findAll = factory.createHandlers(async (c) => {
    const data = await this.service.findAll();

    return c.json(data, 200);
  });

  findById = factory.createHandlers(
    zValidator("param", idParamSchema),
    async (c) => {
      const { id } = c.req.valid("param");
      const data = await this.service.findById(id);

      return c.json(data, 200);
    },
  );

  findBySecret = factory.createHandlers(
    zValidator("param", idParamSchema),
    async (c) => {
      const { id: secret } = c.req.valid("param");
      const data = await this.service.findBySecret(secret);

      return c.json(data, 200);
    },
  );

  update = factory.createHandlers(
    zValidator("param", idParamSchema),
    zValidator("json", updateQrCodeSchema),
    async (c) => {
      const { id } = c.req.valid("param");
      const payload = c.req.valid("json");
      const data = await this.service.update(id, payload);

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
