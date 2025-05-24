import { relations } from "drizzle-orm";
import {
  trashbinsCollectionTable,
  trashbinsIssueTable,
  trashbinsTable,
} from "../schema/trashbin.schema.server";
import { usersTable } from "../schema/user.schema.server";

export const trashbinIssueRelations = relations(
  trashbinsIssueTable,
  ({ one }) => ({
    trashbin: one(trashbinsTable, {
      fields: [trashbinsIssueTable.trashbinId],
      references: [trashbinsTable.id],
    }),
    user: one(usersTable, {
      fields: [trashbinsIssueTable.userId],
      references: [usersTable.id],
    }),
  }),
);

export const trashbinCollectionRelation = relations(
  trashbinsCollectionTable,
  ({ one }) => ({
    trashbin: one(trashbinsTable, {
      fields: [trashbinsCollectionTable.trashbinId],
      references: [trashbinsTable.id],
    }),
    user: one(usersTable, {
      fields: [trashbinsCollectionTable.userId],
      references: [usersTable.id],
    }),
  }),
);
