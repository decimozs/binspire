import type z from "zod";
import type { historyTable } from "./schema";
import type { insertHistorySchema, updateHistorySchema } from "./validators";

export type History = typeof historyTable.$inferSelect;

export type InsertHistory = z.infer<typeof insertHistorySchema>;

export type UpdateHistory = z.infer<typeof updateHistorySchema>;
