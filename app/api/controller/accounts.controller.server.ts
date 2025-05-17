import { errorResponse, factory, successResponse } from "@/lib/utils";
import { idParamSchema } from "@/lib/validations.server";
import { zValidator } from "@hono/zod-validator";
import { AccountService } from "../service/accounts.service.server";
import { createAccountSchema, updateAccountSchema } from "@/db";
import { z } from "zod";
import type { AccountProvider } from "@/lib/types";

const getAccountById = factory.createHandlers(
  zValidator("param", idParamSchema),
  async (c) => {
    try {
      const { id } = c.req.valid("param");
      const data = await AccountService.getAccountById(id);
      return successResponse(c, data);
    } catch (error) {
      return errorResponse(c, error);
    }
  },
);

const getAccountByProviderId = factory.createHandlers(
  zValidator("param", idParamSchema),
  async (c) => {
    try {
      const { id } = c.req.valid("param");
      const providerId = id as AccountProvider;
      const data = await AccountService.getAccountByProviderId(providerId);
      return successResponse(c, data);
    } catch (error) {
      return errorResponse(c, error);
    }
  },
);

const getAccountByAccountId = factory.createHandlers(
  zValidator("param", idParamSchema),
  async (c) => {
    try {
      const { id } = c.req.valid("param");
      const data = await AccountService.getAccountByAccountId(id);
      return successResponse(c, data);
    } catch (error) {
      return errorResponse(c, error);
    }
  },
);

const createAccount = factory.createHandlers(
  zValidator("json", createAccountSchema),
  async (c) => {
    try {
      const response = c.req.valid("json");
      const data = await AccountService.createAccount(response);
      return successResponse(c, data);
    } catch (error) {
      return errorResponse(c, error);
    }
  },
);

const updateAccount = factory.createHandlers(
  zValidator(
    "param",
    z.object({
      id: z.string().min(1, "Id is required"),
      providerId: z.enum(["email", "google"]),
    }),
  ),
  zValidator("json", updateAccountSchema),
  async (c) => {
    try {
      const { id, providerId } = c.req.valid("param");
      const response = c.req.valid("json");
      const [data] = await AccountService.updateAccount(
        providerId,
        id,
        response,
      );
      return successResponse(c, data);
    } catch (error) {
      return errorResponse(c, error);
    }
  },
);

export const AccountController = {
  getAccountById,
  getAccountByAccountId,
  updateAccount,
  getAccountByProviderId,
  createAccount,
};
