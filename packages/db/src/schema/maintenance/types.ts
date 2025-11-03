import type { z } from "zod/v4";
import { maintenanceTable } from "./schema";
import type {
  insertMaintenanceSchema,
  updateMaintenanceSchema,
} from "./validators";

export type Maintenance = typeof maintenanceTable.$inferSelect;

export type InsertMaintenance = z.infer<typeof insertMaintenanceSchema>;
export type UpdateMaintenance = z.infer<typeof updateMaintenanceSchema>;
