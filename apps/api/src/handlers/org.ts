import { factory } from "@/lib/factory";
import { idParamSchema, zValidator } from "@/lib/utils";
import { OrganizationService, OrganizationSettingsService } from "@/services";
import {
  insertOrganizationSchema,
  insertOrganizationSettingsSchema,
  updateOrganizationSchema,
  updateOrganizationSettingsSchema,
} from "@binspire/db/schema";

export class OrganizationHandler {
  private service = new OrganizationService();

  create = factory.createHandlers(
    zValidator("json", insertOrganizationSchema),
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

  update = factory.createHandlers(
    zValidator("param", idParamSchema),
    zValidator("json", updateOrganizationSchema),
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

export class OrganizationSettingsHandler {
  private service = new OrganizationSettingsService();

  create = factory.createHandlers(
    zValidator("json", insertOrganizationSettingsSchema),
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

  findByOrgId = factory.createHandlers(
    zValidator("param", idParamSchema),
    async (c) => {
      const { id } = c.req.valid("param");
      const data = await this.service.findByOrganizationId(id);

      return c.json(data, 200);
    },
  );

  update = factory.createHandlers(
    zValidator("param", idParamSchema),
    zValidator("json", updateOrganizationSettingsSchema),
    async (c) => {
      const { id } = c.req.valid("param");
      const payload = c.req.valid("json");
      const data = await this.service.update(id, payload);

      return c.json(data, 200);
    },
  );

  updateSecret = factory.createHandlers(
    zValidator("param", idParamSchema),
    zValidator("json", updateOrganizationSettingsSchema.pick({ secret: true })),
    async (c) => {
      const { id } = c.req.valid("param");
      const { secret } = c.req.valid("json");
      const data = await this.service.updateSecret(id, secret as string);

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
