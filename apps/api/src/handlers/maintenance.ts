import {
  insertMaintenanceSchema,
  updateMaintenanceSchema,
} from "@binspire/db/schema";
import { factory } from "@/lib/factory";
import { idParamSchema, zValidator } from "@/lib/utils";
import { MaintenanceService } from "@/services";

export class MaintenanceHandler {
  private service = new MaintenanceService();

  create = factory.createHandlers(
    zValidator("json", insertMaintenanceSchema),
    async (c) => {
      const payload = c.req.valid("json");
      const userId = c.get("user")?.id!;
      const data = await this.service.create(payload, userId);

      return c.json(data, 201);
    },
  );

  findAll = factory.createHandlers(async (c) => {
    const orgId = c.get("user")?.orgId!;
    const data = await this.service.findAll(orgId);

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
    zValidator("json", updateMaintenanceSchema),
    async (c) => {
      const { id } = c.req.valid("param");
      const payload = c.req.valid("json");
      const userId = c.get("user")?.id!;
      const data = await this.service.update(id, payload, userId);

      return c.json(data, 200);
    },
  );

  delete = factory.createHandlers(
    zValidator("param", idParamSchema),
    async (c) => {
      const { id } = c.req.valid("param");
      const userId = c.get("user")?.id!;
      const data = await this.service.delete(id, userId);

      return c.json(data, 200);
    },
  );
}
