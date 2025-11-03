import { historyTable } from "./schema";
import z from "zod";
import type { insertHistorySchema, updateHistorySchema } from "./validators";

export type History = typeof historyTable.$inferSelect;

export type InsertHistory = z.infer<typeof insertHistorySchema>;

export type UpdateHistory = z.infer<typeof updateHistorySchema>;
