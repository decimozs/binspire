import { factory } from "@/lib/factory";
import { idParamSchema, zValidator } from "@/lib/utils";
import {
  UserGreenHeartService,
  UserQuotaService,
  UserInvitationService,
  UserRequestService,
  UserService,
  UserSettingsService,
  UserStatusService,
  UserCollectonAssignmentService,
} from "@/services";
import {
  insertUserGreenHeartSchema,
  insertUserQuotaSchema,
  insertUserInvitationSchema,
  insertUserRequestSchema,
  insertUserSchema,
  insertUserSettingsSchema,
  insertUserStatusSchema,
  insertUserCollectionAssignmentSchema,
  updateUserQuotaSchema,
  updateUserGreenHeartSchema,
  updateUserInvitationSchema,
  updateUserRequestSchema,
  updateUserSchema,
  updateUserSettingsSchema,
  updateUserStatusSchema,
} from "@binspire/db/schema";

export class UserHandler {
  private service = new UserService();

  create = factory.createHandlers(
    zValidator("json", insertUserSchema),
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

  findByEmail = factory.createHandlers(
    zValidator("param", idParamSchema),
    async (c) => {
      const { id: email } = c.req.valid("param");
      const data = await this.service.findByEmail(email);

      return c.json(data, 200);
    },
  );

  update = factory.createHandlers(
    zValidator("param", idParamSchema),
    zValidator("json", updateUserSchema),
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

export class UserInvitationHandler {
  private service = new UserInvitationService();

  create = factory.createHandlers(
    zValidator("json", insertUserInvitationSchema.omit({ userId: true })),
    async (c) => {
      const payload = c.req.valid("json");
      const userId = c.get("user")?.id!;
      const data = await this.service.create({ userId, ...payload }, userId);

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
    zValidator("json", updateUserInvitationSchema),
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
      const userId = c.get("user")?.id!;
      const data = await this.service.delete(id, userId);

      return c.json(data, 200);
    },
  );
}

export class UserRequestHandler {
  private service = new UserRequestService();

  create = factory.createHandlers(
    zValidator("json", insertUserRequestSchema.omit({ orgId: true })),
    async (c) => {
      const payload = c.req.valid("json");
      const user = c.get("user");
      const data = await this.service.create({
        ...payload,
        orgId: user?.orgId!,
      });

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
    zValidator("json", updateUserRequestSchema),
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

export class UserSettingsHandler {
  private service = new UserSettingsService();

  create = factory.createHandlers(
    zValidator("json", insertUserSettingsSchema),
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

  findByUserId = factory.createHandlers(
    zValidator("param", idParamSchema),
    async (c) => {
      const { id: userId } = c.req.valid("param");
      const data = await this.service.findByUserId(userId);

      return c.json(data, 200);
    },
  );

  update = factory.createHandlers(
    zValidator("param", idParamSchema),
    zValidator("json", updateUserSettingsSchema),
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

export class UserStatusHandler {
  private service = new UserStatusService();

  create = factory.createHandlers(
    zValidator("json", insertUserStatusSchema),
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

  findByUserId = factory.createHandlers(
    zValidator("param", idParamSchema),
    async (c) => {
      const { id: userId } = c.req.valid("param");
      const data = await this.service.findByUserId(userId);

      return c.json(data, 200);
    },
  );

  update = factory.createHandlers(
    zValidator("param", idParamSchema),
    zValidator("json", updateUserStatusSchema),
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

export class UserCollectionAssignmentHandler {
  private service = new UserCollectonAssignmentService();

  create = factory.createHandlers(
    zValidator("json", insertUserCollectionAssignmentSchema),
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

  findByUserId = factory.createHandlers(
    zValidator("param", idParamSchema),
    async (c) => {
      const { id: userId } = c.req.valid("param");
      const data = await this.service.findByUserId(userId);

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

export class UserQuotaHandler {
  private service = new UserQuotaService();

  create = factory.createHandlers(
    zValidator("json", insertUserQuotaSchema),
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

  findByUserId = factory.createHandlers(
    zValidator("param", idParamSchema),
    async (c) => {
      const { id: userId } = c.req.valid("param");
      const data = await this.service.findByUserId(userId);

      return c.json(data, 200);
    },
  );

  update = factory.createHandlers(
    zValidator("param", idParamSchema),
    zValidator("json", updateUserQuotaSchema),
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

export class UserGreenHeartHandler {
  private service = new UserGreenHeartService();

  create = factory.createHandlers(
    zValidator("json", insertUserGreenHeartSchema),
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

  findByUserId = factory.createHandlers(
    zValidator("param", idParamSchema),
    async (c) => {
      const { id: userId } = c.req.valid("param");
      const data = await this.service.findByUserId(userId);

      return c.json(data, 200);
    },
  );

  update = factory.createHandlers(
    zValidator("param", idParamSchema),
    zValidator("json", updateUserGreenHeartSchema),
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
