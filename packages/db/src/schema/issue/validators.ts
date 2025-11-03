import { createInsertSchema } from "drizzle-zod";
import { insertExcludedFields } from "../../lib/base";
import { issuesTable } from "./schema";

export const insertIssueSchema = createInsertSchema(issuesTable)
  .omit(insertExcludedFields)
  .strict();

export const updateIssueSchema = insertIssueSchema.partial();
