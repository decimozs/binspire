import { auditTable } from "./schema";
import { insertAuditSchema, updateAuditSchema } from "./validators";
import z from "zod";

export type Audit = typeof auditTable.$inferSelect;

export type InsertAudit = z.infer<typeof insertAuditSchema>;

export type UpdateAudit = z.infer<typeof updateAuditSchema>;
