import { relations } from "drizzle-orm";
import { usersTable } from "../user";
import { auditTable } from "./schema";

export const auditRelations = relations(auditTable, ({ one }) => ({
  user: one(usersTable, {
    fields: [auditTable.userId],
    references: [usersTable.id],
    relationName: "UserAudits",
  }),
}));
