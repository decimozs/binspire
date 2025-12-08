import { relations } from "drizzle-orm";
import { organizationsTable } from "../org";
import { userCollectionAssignmentsTable, usersTable } from "../user";
import {
  trashbinsCollectionsTable,
  trashbinsStatusTable,
  trashbinsTable,
} from "./schema";

export const trashbinRelations = relations(trashbinsTable, ({ one, many }) => ({
  status: one(trashbinsStatusTable, {
    fields: [trashbinsTable.id],
    references: [trashbinsStatusTable.trashbinId],
  }),
  collections: many(trashbinsCollectionsTable),
  assignments: many(userCollectionAssignmentsTable, {
    relationName: "UserCollectionAssignmentsToTrashbin",
  }),
}));

export const trashbinStatusRelations = relations(
  trashbinsStatusTable,
  ({ one }) => ({
    trashbin: one(trashbinsTable, {
      fields: [trashbinsStatusTable.trashbinId],
      references: [trashbinsTable.id],
    }),
  }),
);

export const trashbinCollectionsRelations = relations(
  trashbinsCollectionsTable,
  ({ one }) => ({
    trashbin: one(trashbinsTable, {
      fields: [trashbinsCollectionsTable.trashbinId],
      references: [trashbinsTable.id],
    }),
    organization: one(organizationsTable, {
      fields: [trashbinsCollectionsTable.orgId],
      references: [organizationsTable.id],
    }),
    collector: one(usersTable, {
      fields: [trashbinsCollectionsTable.collectedBy],
      references: [usersTable.id],
      relationName: "UserCollections",
    }),
  }),
);
