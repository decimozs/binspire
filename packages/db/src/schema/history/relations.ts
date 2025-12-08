import { relations } from "drizzle-orm";
import { usersTable } from "../user";
import { historyTable } from "./schema";

export const historyRelations = relations(historyTable, ({ one }) => ({
  user: one(usersTable, {
    fields: [historyTable.userId],
    references: [usersTable.id],
    relationName: "UserHistory",
  }),
}));
