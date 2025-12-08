import { createInsertSchema } from "drizzle-zod";
import { insertExcludedFields } from "../../lib/base";
import { historyTable } from "./schema";

export const insertHistorySchema = createInsertSchema(historyTable)
  .omit(insertExcludedFields)
  .strict();

export const updateHistorySchema = insertHistorySchema.partial();
