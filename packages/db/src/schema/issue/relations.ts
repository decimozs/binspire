import { relations } from "drizzle-orm";
import { usersTable } from "../user";
import { issuesTable } from "./schema";

export const issueRelations = relations(issuesTable, ({ one }) => ({
  user: one(usersTable, {
    fields: [issuesTable.userId],
    references: [usersTable.id],
    relationName: "UserIssues",
  }),
}));
