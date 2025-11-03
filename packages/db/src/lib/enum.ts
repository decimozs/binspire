import { pgEnum } from "drizzle-orm/pg-core";
import {
  AUDIT_ACTIONS,
  INVITATION_STATUSES,
  ISSUE_STATUSES,
  PRIORITY_SCORES,
  REQUEST_STATUSES,
  SYSTEM_ENTITY,
} from "./constants";

export const ISSUE_STATUSES_ENUM = pgEnum("issue_status", ISSUE_STATUSES);

export const PRIORITY_SCORES_ENUM = pgEnum("priority_scores", PRIORITY_SCORES);

export const SYSTEM_ENTITY_ENUM = pgEnum("system_entity", SYSTEM_ENTITY);

export const INVITATION_STATUSES_ENUM = pgEnum(
  "invitation_status",
  INVITATION_STATUSES,
);

export const REQUEST_STATUSES_ENUM = pgEnum("request_status", REQUEST_STATUSES);

export const AUDIT_ACTIONS_ENUM = pgEnum("audit_action", AUDIT_ACTIONS);
