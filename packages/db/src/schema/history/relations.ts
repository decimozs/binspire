import { relations } from "drizzle-orm";
import { historyTable } from "./schema";
import { usersTable } from "../user";

export const historyRelations = relations(historyTable, ({ one }) => ({
  user: one(usersTable, {
    fields: [historyTable.userId],
    references: [usersTable.id],
    relationName: "UserHistory",
  }),
}));
