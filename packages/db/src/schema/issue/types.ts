import type z from "zod";
import type { issuesTable } from "./schema";
import type { insertIssueSchema, updateIssueSchema } from "./validators";

export type Issue = typeof issuesTable.$inferSelect;
export type InsertIssue = z.infer<typeof insertIssueSchema>;
export type UpdateIssue = z.infer<typeof updateIssueSchema>;
