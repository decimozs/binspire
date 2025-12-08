import {
  insertTrashbinCollectionSchema,
  insertTrashbinSchema,
  insertTrashbinStatusSchema,
  updateTrashbinCollectionSchema,
  updateTrashbinSchema,
  updateTrashbinStatusSchema,
} from "@binspire/db/schema";
import { factory } from "@/lib/factory";
import { idParamSchema, zValidator } from "@/lib/utils";
import {
  TrashbinCollectionService,
  TrashbinService,
  TrashbinStatusService,
} from "@/services";

export class TrashbinHandler {
  private service = new TrashbinService();

  create = factory.createHandlers(
    zValidator("json", insertTrashbinSchema),
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
    zValidator("json", updateTrashbinSchema),
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

  collect = factory.createHandlers(
    zValidator("param", idParamSchema),
    zValidator(
      "json",
      insertTrashbinCollectionSchema.pick({
        wasteLevel: true,
        weightLevel: true,
        batteryLevel: true,
        logs: true,
      }),
    ),
    async (c) => {
      const { id } = c.req.valid("param");
      const payload = c.req.valid("json");
      const orgId = c.get("user")?.orgId!;
      const userId = c.get("user")?.id!;
      const data = await this.service.collect(id, {
        orgId,
        collectedBy: userId,
        trashbinId: id,
        ...payload,
      });

      return c.json(data, 200);
    },
  );
}

export class TrashbinCollectionHandler {
  private service = new TrashbinCollectionService();

  create = factory.createHandlers(
    zValidator("json", insertTrashbinCollectionSchema),
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

  findByTrashbinId = factory.createHandlers(
    zValidator("param", idParamSchema),
    async (c) => {
      const { id } = c.req.valid("param");
      const data = await this.service.findByTrashbinId(id);

      return c.json(data, 200);
    },
  );

  findByUserId = factory.createHandlers(
    zValidator("param", idParamSchema),
    async (c) => {
      const { id } = c.req.valid("param");
      const data = await this.service.findByUserId(id);

      return c.json(data, 200);
    },
  );

  update = factory.createHandlers(
    zValidator("param", idParamSchema),
    zValidator("json", updateTrashbinCollectionSchema),
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

export class TrashbinStatusHandler {
  private service = new TrashbinStatusService();

  create = factory.createHandlers(
    zValidator("json", insertTrashbinStatusSchema),
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

  findByTrashbinId = factory.createHandlers(
    zValidator("param", idParamSchema),
    async (c) => {
      const { id } = c.req.valid("param");
      const data = await this.service.findByTrashbinId(id);

      return c.json(data, 200);
    },
  );

  update = factory.createHandlers(
    zValidator("param", idParamSchema),
    zValidator("json", updateTrashbinStatusSchema),
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
