import { errorResponse, factory, successResponse } from "@/lib/utils";
import { ORSService } from "../service/ors.service.server";
import { zValidator } from "@hono/zod-validator";
import { directionsSchema } from "@/lib/validations.server";

const getDirections = factory.createHandlers(
  zValidator("query", directionsSchema),
  async (c) => {
    try {
      const { start, end, api_key } = c.req.valid("query");
      const params = new URLSearchParams({
        start,
        end,
        api_key,
      });
      const response = await ORSService.getDirections(params);
      return successResponse(c, response);
    } catch (error) {
      return errorResponse(c, error);
    }
  },
);

export const ORSController = {
  getDirections,
};
