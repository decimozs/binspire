import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";
import {
  accountsTable,
  qrCodesTable,
  sessionsTable,
  verificationsTable,
} from "./schema";
import { insertExcludedFields } from "../../lib/base";

export const insertSessionSchema = createInsertSchema(sessionsTable)
  .omit(insertExcludedFields)
  .strict();

export const updateSessionSchema = insertSessionSchema.partial();

export const insertAccountSchema = createInsertSchema(accountsTable)
  .omit(insertExcludedFields)
  .strict();

export const updateAccountSchema = insertAccountSchema.partial();

export const insertVerificationSchema = createInsertSchema(verificationsTable)
  .omit(insertExcludedFields)
  .extend({
    expiresAt: z.coerce
      .date()
      .default(() => new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)),
  })
  .strict();

export const updateVerificationSchema = insertVerificationSchema.partial();

export const insertQrCodeSchema = createInsertSchema(qrCodesTable)
  .omit(insertExcludedFields)
  .strict();

export const updateQrCodeSchema = insertQrCodeSchema.partial();
