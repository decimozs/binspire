import { relations } from "drizzle-orm";
import { issuesTable } from "./schema";
import { usersTable } from "../user";

export const issueRelations = relations(issuesTable, ({ one }) => ({
  user: one(usersTable, {
    fields: [issuesTable.userId],
    references: [usersTable.id],
    relationName: "UserIssues",
  }),
}));
