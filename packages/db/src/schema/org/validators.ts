import { createInsertSchema } from "drizzle-zod";
import { insertExcludedFields } from "../../lib/base";
import { organizationSettingsTable, organizationsTable } from "./schema";

export const insertOrganizationSchema = createInsertSchema(organizationsTable)
  .omit(insertExcludedFields)
  .strict();

export const updateOrganizationSchema = insertOrganizationSchema.partial();

export const insertOrganizationSettingsSchema = createInsertSchema(
  organizationSettingsTable,
)
  .omit(insertExcludedFields)
  .strict();

export const updateOrganizationSettingsSchema =
  insertOrganizationSettingsSchema.partial();
