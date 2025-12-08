import { logger } from "@binspire/logging";
import { zValidator as zv } from "@hono/zod-validator";
import type { ValidationTargets } from "hono";
import z from "zod";
import type { ZodSchema } from "zod/v4";
import { BadRequestError } from "@/features/error";

export const zValidator = <
  T extends ZodSchema,
  Target extends keyof ValidationTargets,
>(
  target: Target,
  schema: T,
) =>
  zv(target, schema, (result) => {
    if (!result.success) {
      logger.error(`Validation error: ${JSON.stringify(result.error.issues)}`);
      throw new BadRequestError("Bad request", result?.error.issues);
    }
  });

export const idParamSchema = z.object({
  id: z.string().min(1, "ID is required"),
});

export function rewriteURL(url: string): string {
  const isDev = process.env.NODE_ENV === "development";
  const newBaseUrl = isDev
    ? "http://localhost:8080/v1/api/auth"
    : "https://api.binspire.space/v1/api/auth";

  return url.replace(/^https?:\/\/[^/]+\/api\/auth/, newBaseUrl);
}
