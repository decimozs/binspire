import { relations } from "drizzle-orm";
import {
  userSettingsTable,
  usersTable,
  userStatusTable,
  usersRequestsTable,
  userCollectionAssignmentsTable,
  userInvitationsTable,
  userGreenHeartsTable,
} from "./schema";
import { auditTable } from "../audit";
import { historyTable } from "../history";
import { issuesTable } from "../issue";
import { trashbinsCollectionsTable, trashbinsTable } from "../trashbin";

export const userRelations = relations(usersTable, ({ one, many }) => ({
  status: one(userStatusTable, {
    fields: [usersTable.id],
    references: [userStatusTable.userId],
  }),
  settings: one(userSettingsTable, {
    fields: [usersTable.id],
    references: [userSettingsTable.userId],
  }),
  requests: many(usersRequestsTable, {
    relationName: "UserRequests",
  }),
  audits: many(auditTable, {
    relationName: "UserAudits",
  }),
  history: many(historyTable, {
    relationName: "UserHistory",
  }),
  issues: many(issuesTable, {
    relationName: "UserIssues",
  }),
  collections: many(trashbinsCollectionsTable, {
    relationName: "UserCollections",
  }),
  assignCollections: many(userCollectionAssignmentsTable, {
    relationName: "UserCollectionAssignmentsToUser",
  }),
  invites: many(userInvitationsTable, {
    relationName: "UserInvitations",
  }),
  greenhearts: many(userGreenHeartsTable, {
    relationName: "UserGreenHearts",
  }),
}));

export const userRequestsRelations = relations(
  usersRequestsTable,
  ({ one }) => ({
    user: one(usersTable, {
      fields: [usersRequestsTable.userId],
      references: [usersTable.id],
      relationName: "UserRequests",
    }),
  }),
);

export const userCollectionAssignmentsRelations = relations(
  userCollectionAssignmentsTable,
  ({ one }) => ({
    user: one(usersTable, {
      fields: [userCollectionAssignmentsTable.userId],
      references: [usersTable.id],
      relationName: "UserCollectionAssignmentsToUser",
    }),
    trashbin: one(trashbinsTable, {
      fields: [userCollectionAssignmentsTable.trashbinId],
      references: [trashbinsTable.id],
      relationName: "UserCollectionAssignmentsToTrashbin",
    }),
  }),
);

export const userInvitationsRelations = relations(
  userInvitationsTable,
  ({ one }) => ({
    user: one(usersTable, {
      fields: [userInvitationsTable.userId],
      references: [usersTable.id],
      relationName: "UserInvitations",
    }),
  }),
);

export const userGreenHeartsRelations = relations(
  userGreenHeartsTable,
  ({ one }) => ({
    user: one(usersTable, {
      fields: [userGreenHeartsTable.userId],
      references: [usersTable.id],
      relationName: "UserGreenHearts",
    }),
  }),
);
