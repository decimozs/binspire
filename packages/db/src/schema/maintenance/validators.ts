import { createInsertSchema } from "drizzle-zod";
import { insertExcludedFields } from "../../lib/base";
import { maintenanceTable } from "./schema";

export const insertMaintenanceSchema = createInsertSchema(maintenanceTable)
  .omit(insertExcludedFields)
  .strict();

export const updateMaintenanceSchema = insertMaintenanceSchema.partial();
