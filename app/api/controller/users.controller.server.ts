import { UserService } from "../service/users.service.server";
import { errorResponse, factory, successResponse } from "@/lib/utils";
import { updateUserSchema } from "@/db";
import { zValidator } from "@hono/zod-validator";
import { idParamSchema } from "@/lib/validations.server";

const getAllUsers = factory.createHandlers(async (c) => {
  try {
    const data = await UserService.getAllUsers();
    return successResponse(c, data);
  } catch (error) {
    return errorResponse(c, error);
  }
});

const getUserById = factory.createHandlers(
  zValidator("param", idParamSchema),
  async (c) => {
    try {
      const { id } = c.req.valid("param");
      const data = await UserService.getUserById(id);
      return successResponse(c, data);
    } catch (error) {
      return errorResponse(c, error);
    }
  },
);

const getAllActivityLogs = factory.createHandlers(async (c) => {
  try {
    const data = await UserService.getAllActivityLogs();
    return successResponse(c, data);
  } catch (error) {
    return errorResponse(c, error);
  }
});

const getAllAccessRequests = factory.createHandlers(async (c) => {
  try {
    const data = await UserService.getAllAccessRequests();
    return successResponse(c, data);
  } catch (error) {
    return errorResponse(c, error);
  }
});

const getAllComments = factory.createHandlers(async (c) => {
  try {
    const data = await UserService.getAllComments();
    return successResponse(c, data);
  } catch (error) {
    return errorResponse(c, error);
  }
});

const getAllActivityLogsById = factory.createHandlers(
  zValidator("param", idParamSchema),
  async (c) => {
    try {
      const { id } = c.req.valid("param");
      const data = await UserService.getActivityLogsBy.Id(id);
      return successResponse(c, data);
    } catch (error) {
      return errorResponse(c, error);
    }
  },
);

const getAllActivityLogsByUserId = factory.createHandlers(
  zValidator("param", idParamSchema),
  async (c) => {
    try {
      const { id } = c.req.valid("param");
      const data = await UserService.getActivityLogsBy.UserId(id);
      return successResponse(c, data);
    } catch (error) {
      return errorResponse(c, error);
    }
  },
);

const updateUser = factory.createHandlers(
  zValidator("json", updateUserSchema),
  zValidator("param", idParamSchema),
  async (c) => {
    try {
      const { id } = c.req.valid("param");
      const response = c.req.valid("json");
      const data = await UserService.updateUser(id, response);
      return successResponse(c, data);
    } catch (error) {
      return errorResponse(c, error);
    }
  },
);

export const UserController = {
  getAllUsers,
  getAllActivityLogs,
  getUserById,
  getAllAccessRequests,
  getAllComments,
  getAllActivityLogsById,
  getAllActivityLogsByUserId,
  updateUser,
};
