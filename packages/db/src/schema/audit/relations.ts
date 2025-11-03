import { relations } from "drizzle-orm";
import { auditTable } from "./schema";
import { usersTable } from "../user";

export const auditRelations = relations(auditTable, ({ one }) => ({
  user: one(usersTable, {
    fields: [auditTable.userId],
    references: [usersTable.id],
    relationName: "UserAudits",
  }),
}));
