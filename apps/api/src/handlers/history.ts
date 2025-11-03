import { factory } from "@/lib/factory";
import { HistoryService } from "@/services";
import { idParamSchema, zValidator } from "@/lib/utils";
import { insertHistorySchema, updateHistorySchema } from "@binspire/db/schema";

export class HistoryHandler {
  private service = new HistoryService();

  create = factory.createHandlers(
    zValidator("json", insertHistorySchema),
    async (c) => {
      const payload = c.req.valid("json");
      const data = await this.service.create(payload);

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
    zValidator("json", updateHistorySchema),
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
