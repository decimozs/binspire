import { auditTable } from "./schema";
import { createInsertSchema } from "drizzle-zod";
import { insertExcludedFields } from "../../lib/base";

export const insertAuditSchema = createInsertSchema(auditTable)
  .omit(insertExcludedFields)
  .strict();

export const updateAuditSchema = insertAuditSchema.partial();
