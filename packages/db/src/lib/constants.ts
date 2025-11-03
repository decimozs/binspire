import type { PermissionModuleKeys } from "./types";

export const ISSUE_STATUSES = [
  "open",
  "in_progress",
  "resolved",
  "closed",
] as const;

export const PRIORITY_SCORES = ["low", "medium", "high", "critical"] as const;

export const ENTITY_KEYS = [
  "userManagement",
  "trashbinManagement",
  "settingsManagement",
  "dashboardManagement",
  "boardManagement",
  "issueManagement",
  "activityManagement",
  "historyManagement",
  "accessRequestsManagement",
  "invitationsManagement",
  "collectionsManagement",
  "mapManagement",
  "greenHeartsManagement",
] as const satisfies PermissionModuleKeys[];

export const SYSTEM_ENTITY = [
  ...ENTITY_KEYS,
  "authentication",
  "authorization",
] as const;

export const INVITATION_STATUSES = [
  "pending",
  "accepted",
  "rejected",
  "expired",
  "confirmed",
] as const;

export const REQUEST_STATUSES = ["pending", "approved", "rejected"] as const;

export const AUDIT_ACTIONS = [
  "create",
  "update",
  "delete",
  "archive",
  "restore",
  "login",
  "logout",
  "invite",
  "accept_invite",
  "reject_invite",
  "approve_request",
  "reject_request",
] as const;
