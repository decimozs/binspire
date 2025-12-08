import { createInsertSchema } from "drizzle-zod";
import { insertExcludedFields } from "../../lib/base";
import {
  userCollectionAssignmentsTable,
  userGreenHeartsTable,
  userInvitationsTable,
  userQuotaTable,
  userSettingsTable,
  userStatusTable,
  usersRequestsTable,
  usersTable,
} from "./schema";

export const insertUserSchema = createInsertSchema(usersTable)
  .omit(insertExcludedFields)
  .strict();
export const insertUserStatusSchema = createInsertSchema(userStatusTable);
export const insertUserSettingsSchema = createInsertSchema(userSettingsTable)
  .omit(insertExcludedFields)
  .strict();
export const insertUserInvitationSchema =
  createInsertSchema(userInvitationsTable);
export const insertUserRequestSchema = createInsertSchema(usersRequestsTable)
  .omit(insertExcludedFields)
  .strict();
export const insertUserCollectionAssignmentSchema = createInsertSchema(
  userCollectionAssignmentsTable,
)
  .omit(insertExcludedFields)
  .strict();
export const insertUserQuotaSchema = createInsertSchema(userQuotaTable)
  .omit(insertExcludedFields)
  .strict();
export const insertUserGreenHeartSchema = createInsertSchema(
  userGreenHeartsTable,
)
  .omit(insertExcludedFields)
  .strict();

export const updateUserSchema = insertUserSchema.partial();
export const updateUserStatusSchema = insertUserStatusSchema.partial();
export const updateUserSettingsSchema = insertUserSettingsSchema.partial();
export const updateUserInvitationSchema = insertUserInvitationSchema.partial();
export const updateUserRequestSchema = insertUserRequestSchema.partial();
export const updateUserCollectionAssignmentSchema =
  insertUserCollectionAssignmentSchema.partial();
export const updateUserQuotaSchema = insertUserQuotaSchema.partial();
export const updateUserGreenHeartSchema = insertUserGreenHeartSchema.partial();
