import { historyTable } from "./schema";
import { createInsertSchema } from "drizzle-zod";
import { insertExcludedFields } from "../../lib/base";

export const insertHistorySchema = createInsertSchema(historyTable)
  .omit(insertExcludedFields)
  .strict();

export const updateHistorySchema = insertHistorySchema.partial();
