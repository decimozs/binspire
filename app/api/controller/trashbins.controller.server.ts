import { errorResponse, factory, successResponse } from "@/lib/utils";
import { TrashbinService } from "../service/trashbins.service.server";
import {
  createTrashbinCollectionSchema,
  createTrashbinIssueSchema,
  updateTrashbinIssueSchema,
  updateTrashbinSchema,
} from "@/db";
import { zValidator } from "@hono/zod-validator";
import { idParamSchema } from "@/lib/validations.server";

const getAllTrashbins = factory.createHandlers(async (c) => {
  try {
    const data = await TrashbinService.getAllTrashbins();
    return successResponse(c, data);
  } catch (error) {
    return errorResponse(c, error);
  }
});

const getTrashbinById = factory.createHandlers(
  zValidator("param", idParamSchema),
  async (c) => {
    try {
      const { id } = c.req.valid("param");
      const data = await TrashbinService.getTrashbinById(id);
      return successResponse(c, data);
    } catch (error) {
      return errorResponse(c, error);
    }
  },
);

const updateTrashbin = factory.createHandlers(
  zValidator("param", idParamSchema),
  zValidator("json", updateTrashbinSchema),
  async (c) => {
    try {
      const { id } = c.req.valid("param");
      const response = c.req.valid("json");
      const [data] = await TrashbinService.updateTrashbin(id, response);
      return successResponse(c, data);
    } catch (error) {
      return errorResponse(c, error);
    }
  },
);

const deleteTrashbin = factory.createHandlers(
  zValidator("param", idParamSchema),
  async (c) => {
    try {
      const { id } = c.req.valid("param");
      const [data] = await TrashbinService.deleteTrashbin(id);
      return successResponse(c, data);
    } catch (error) {
      return errorResponse(c, error);
    }
  },
);

const createTrashbinIssue = factory.createHandlers(
  zValidator("json", createTrashbinIssueSchema),
  async (c) => {
    try {
      const response = c.req.valid("json");
      const [data] = await TrashbinService.createTrashbinIssue(response);
      return successResponse(c, data);
    } catch (error) {
      return errorResponse(c, error);
    }
  },
);

const createTrashbinCollection = factory.createHandlers(
  zValidator("json", createTrashbinCollectionSchema),
  async (c) => {
    try {
      const response = c.req.valid("json");
      const [data] = await TrashbinService.createTrashbinCollection(response);
      return successResponse(c, data);
    } catch (error) {
      return errorResponse(c, error);
    }
  },
);

const updateTrashbinIssue = factory.createHandlers(
  zValidator("param", idParamSchema),
  zValidator("json", updateTrashbinIssueSchema),
  async (c) => {
    try {
      const { id } = c.req.valid("param");
      const response = c.req.valid("json");
      const [data] = await TrashbinService.updateTrashbinIssue(id, response);
      return successResponse(c, data);
    } catch (error) {
      return errorResponse(c, error);
    }
  },
);

const updateTrashbinCollection = factory.createHandlers(
  zValidator("param", idParamSchema),
  zValidator("json", updateTrashbinIssueSchema),
  async (c) => {
    try {
      const { id } = c.req.valid("param");
      const response = c.req.valid("json");
      const [data] = await TrashbinService.updateTrashbinCollection(
        id,
        response,
      );
      return successResponse(c, data);
    } catch (error) {
      return errorResponse(c, error);
    }
  },
);

const getAllTrashbinsIssue = factory.createHandlers(async (c) => {
  try {
    const data = await TrashbinService.getAllTrashbinsIssue();
    return successResponse(c, data);
  } catch (error) {
    return errorResponse(c, error);
  }
});

const getAllTrashbinsCollection = factory.createHandlers(async (c) => {
  try {
    const data = await TrashbinService.getAllTrashbinsCollection();
    return successResponse(c, data);
  } catch (error) {
    return errorResponse(c, error);
  }
});

const getTrashbinsIssueById = factory.createHandlers(
  zValidator("param", idParamSchema),
  async (c) => {
    try {
      const { id } = c.req.valid("param");
      const data = await TrashbinService.getTrashbinIssueById(id);
      return successResponse(c, data);
    } catch (error) {
      return errorResponse(c, error);
    }
  },
);

const getTrashbinCollectionById = factory.createHandlers(
  zValidator("param", idParamSchema),
  async (c) => {
    try {
      const { id } = c.req.valid("param");
      const data = await TrashbinService.getTrashbinCollectionById(id);
      return successResponse(c, data);
    } catch (error) {
      return errorResponse(c, error);
    }
  },
);

const deleteTrashbinIssue = factory.createHandlers(
  zValidator("param", idParamSchema),
  async (c) => {
    try {
      const { id } = c.req.valid("param");
      const [data] = await TrashbinService.deleteTrashbinIssue(id);
      return successResponse(c, data);
    } catch (error) {
      return errorResponse(c, error);
    }
  },
);

const deleteTrashbinCollection = factory.createHandlers(
  zValidator("param", idParamSchema),
  async (c) => {
    try {
      const { id } = c.req.valid("param");
      const [data] = await TrashbinService.deleteTrashbinCollection(id);
      return successResponse(c, data);
    } catch (error) {
      return errorResponse(c, error);
    }
  },
);

export const TrashbinController = {
  getAllTrashbins,
  getTrashbinById,
  updateTrashbin,
  createTrashbinCollection,
  deleteTrashbin,
  createTrashbinIssue,
  updateTrashbinIssue,
  updateTrashbinCollection,
  getAllTrashbinsIssue,
  getAllTrashbinsCollection,
  getTrashbinCollectionById,
  getTrashbinsIssueById,
  deleteTrashbinCollection,
  deleteTrashbinIssue,
};
