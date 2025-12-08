import type z from "zod";
import type { organizationSettingsTable, organizationsTable } from "./schema";
import type {
  insertOrganizationSchema,
  insertOrganizationSettingsSchema,
  updateOrganizationSchema,
  updateOrganizationSettingsSchema,
} from "./validators";

export type Organization = typeof organizationsTable.$inferSelect;
export type InsertOrganization = z.infer<typeof insertOrganizationSchema>;
export type UpdateOrganization = z.infer<typeof updateOrganizationSchema>;

export type OrganizationSettings =
  typeof organizationSettingsTable.$inferSelect;
export type InsertOrganizationSettings = z.infer<
  typeof insertOrganizationSettingsSchema
>;
export type UpdateOrganizationSettings = z.infer<
  typeof updateOrganizationSettingsSchema
>;
