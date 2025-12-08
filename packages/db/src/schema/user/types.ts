import type { z } from "zod/v4";
import type {
  userCollectionAssignmentsTable,
  userGreenHeartsTable,
  userInvitationsTable,
  userQuotaTable,
  userSettingsTable,
  userStatusTable,
  usersRequestsTable,
  usersTable,
} from "./schema";
import type {
  insertUserCollectionAssignmentSchema,
  insertUserGreenHeartSchema,
  insertUserInvitationSchema,
  insertUserQuotaSchema,
  insertUserRequestSchema,
  insertUserSchema,
  insertUserSettingsSchema,
  insertUserStatusSchema,
  updateUserCollectionAssignmentSchema,
  updateUserGreenHeartSchema,
  updateUserInvitationSchema,
  updateUserQuotaSchema,
  updateUserRequestSchema,
  updateUserSchema,
  updateUserSettingsSchema,
  updateUserStatusSchema,
} from "./validators";

export type User = typeof usersTable.$inferSelect;
export type UserSettings = typeof userSettingsTable.$inferSelect;
export type UserStatus = typeof userStatusTable.$inferSelect;
export type UserInvitation = z.infer<typeof userInvitationsTable.$inferSelect>;
export type UserRequest = z.infer<typeof usersRequestsTable.$inferSelect>;
export type UserCollectionAssignment = z.infer<
  typeof userCollectionAssignmentsTable.$inferSelect
>;
export type UserQuota = z.infer<typeof userQuotaTable.$inferSelect>;
export type UserGreenHeart = z.infer<typeof userGreenHeartsTable.$inferSelect>;

export type InsertUser = z.infer<typeof insertUserSchema>;
export type InsertUserStatus = z.infer<typeof insertUserStatusSchema>;
export type InsertUserSettings = z.infer<typeof insertUserSettingsSchema>;
export type InsertUserInvitation = z.infer<typeof insertUserInvitationSchema>;
export type InsertUserRequest = z.infer<typeof insertUserRequestSchema>;
export type InsertUserCollectionAssignment = z.infer<
  typeof insertUserCollectionAssignmentSchema
>;
export type InsertUserQuota = z.infer<typeof insertUserQuotaSchema>;
export type InsertUserGreenHeart = z.infer<typeof insertUserGreenHeartSchema>;

export type UpdateUser = z.infer<typeof updateUserSchema>;
export type UpdateUserStatus = z.infer<typeof updateUserStatusSchema>;
export type UpdateUserSettings = z.infer<typeof updateUserSettingsSchema>;
export type UpdateUserInvitation = z.infer<typeof updateUserInvitationSchema>;
export type UpdateUserRequest = z.infer<typeof updateUserRequestSchema>;
export type UpdateUserCollectionAssignment = z.infer<
  typeof updateUserCollectionAssignmentSchema
>;
export type UpdateUserQuota = z.infer<typeof updateUserQuotaSchema>;
export type UpdateUserGreenHeart = z.infer<typeof updateUserGreenHeartSchema>;
