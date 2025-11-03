import { createInsertSchema } from "drizzle-zod";
import { maintenanceTable } from "./schema";
import { insertExcludedFields } from "../../lib/base";

export const insertMaintenanceSchema = createInsertSchema(maintenanceTable)
  .omit(insertExcludedFields)
  .strict();

export const updateMaintenanceSchema = insertMaintenanceSchema.partial();
