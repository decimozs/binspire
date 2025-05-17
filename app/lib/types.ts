import type { UserRepository } from "@/api/repository/users.repository.server";
import {
  trashbinsTable,
  userActivityTable,
  userNotificationsTable,
  type requestAccessTable,
  type sessionsTable,
  type userCommentTable,
  type usersTable,
} from "@/db";
import type {
  getActivityLogs,
  getActivityLogsByActivityId,
  getUserActivities,
} from "@/query/users.query.server";
import type { LucideIcon } from "lucide-react";
import type { z, ZodTypeAny } from "zod";
import type { TRASHBIN_STATUSES } from "./constants";

export type Notification = typeof userNotificationsTable.$inferSelect;
export type CreateNotification = typeof userNotificationsTable.$inferInsert;

export type Session = typeof sessionsTable.$inferInsert;

export type VerificationType =
  | "request-access"
  | "forgot-password"
  | "email-verification";

export type VerificationStatus = "success" | "failed" | null;

export type User = typeof usersTable.$inferSelect;

export type SessionData = Session & Pick<User, "permission">;

export interface Teams {
  name: string;
  icon: LucideIcon;
  onlines: string;
}

export type AccessRequests = typeof requestAccessTable.$inferSelect;

export type CreateActivityLog = typeof userActivityTable.$inferInsert;

type FormErrors<T extends ZodTypeAny> =
  z.inferFlattenedErrors<T>["fieldErrors"];

export type FormProps<T extends ZodTypeAny> = {
  actionSuccess?: boolean | undefined;
  actionErrors: string | FormErrors<T> | undefined;
  loaderError?: string | null;
};

export interface GooglePayload {
  email: string;
  name: string;
  image: string;
  emailStatus: boolean;
  accountId: string;
  token: string;
  scopes: string;
  expiresIn: number;
}

export type UserComment = typeof userCommentTable.$inferSelect;

export type ActivityLogs = Awaited<ReturnType<typeof getActivityLogs>>;
export type UserActivity = Awaited<ReturnType<typeof getUserActivities>>;
export type Activity = Awaited<ReturnType<typeof getActivityLogsByActivityId>>;

export type Role = "admin" | "collector";
export type Permission = "editor" | "viewer" | "full-access";
export type Action =
  | "create"
  | "delete"
  | "update"
  | "archive"
  | "login"
  | "sign-up"
  | "logout";
export type Status =
  | "active"
  | "success"
  | "failed"
  | "pending"
  | "blocked"
  | "approved"
  | "rejected";
export type Title =
  | "access-request"
  | "user-management"
  | "roles-permissions"
  | "authentication"
  | "activity-logs"
  | "history"
  | "audit"
  | "settings";

export interface Broadcast {
  transaction: string;
  type?: string;
  status?: boolean;
  reason?: string;
  email?: string;
  token?: string;
}

export type Comment = Awaited<ReturnType<typeof UserRepository.getAllComments>>;
export type ActivityLog = Awaited<
  ReturnType<typeof UserRepository.getActivityLogsById>
>;

export type Trashbin = typeof trashbinsTable.$inferSelect;

export type TrashbinStatus = (typeof TRASHBIN_STATUSES)[number];

export interface MapLayer {
  layer: string;
  layerImage: string;
  name: string;
}

export interface FilterTrashbinOption {
  label: string;
  value: string;
  color: string;
}

export interface FilterTrashbinGroup {
  key: "wl" | "ws" | "bs";
  label: string;
  setParamKey: string;
  options: FilterTrashbinOption[];
}

export type APIBindings = {
  Variables: {
    myVar: string;
  };
};

export type AccountProvider = "email" | "google";

export interface GoogleToken {
  token: string;
  expires_in: number;
}

export type GoogleGrantedScopes = string[];

export interface GoogleUser {
  id: string;
  email: string;
  verified_email: boolean;
  name: string;
  given_name?: string;
  family_name?: string;
  picture: string;
  hd?: string;
}

export interface DirectionsGeoJSON {
  success: boolean;
  data: GeoJSONData;
}

export interface GeoJSONData {
  type: string;
  bbox: number[];
  features: Feature[];
  metadata: Metadata;
}

export interface Feature {
  bbox?: number[];
  type: string;
  properties?: Properties;
  geometry: Geometry;
}

export interface Geometry {
  coordinates: Array<number[]>;
  type: string;
}

export interface Properties {
  segments: Segment[];
  way_points: number[];
  summary: Summary;
}

export interface Segment {
  distance: number;
  duration: number;
  steps: Step[];
}

export interface Step {
  distance: number;
  duration: number;
  type: number;
  instruction: string;
  name: string;
  way_points: number[];
  exit_number?: number;
}

export interface Summary {
  distance: number;
  duration: number;
}

export interface Metadata {
  attribution: string;
  service: string;
  timestamp: number;
  query: Query;
}

export interface Engine {
  version: string;
  build_date: Date;
  graph_date: Date;
}

export interface Query {
  coordinates: Array<number[]>;
  profile: string;
  profileName: string;
  format: string;
}
