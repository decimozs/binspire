import type z from "zod";
import type { auditTable } from "./schema";
import type { insertAuditSchema, updateAuditSchema } from "./validators";

export type Audit = typeof auditTable.$inferSelect;

export type InsertAudit = z.infer<typeof insertAuditSchema>;

export type UpdateAudit = z.infer<typeof updateAuditSchema>;
