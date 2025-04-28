import type {
  requestAccessTable,
  sessionsTable,
  userActivityTable,
  userCommentTable,
  usersTable,
} from "@/db";
import type { getActivityLogs, getUserActivities } from "@/query/users.server";
import type { LucideIcon } from "lucide-react";
import type { z, ZodTypeAny } from "zod";

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

export type RequestAccess = typeof requestAccessTable.$inferSelect;

export type ActivityLog = typeof userActivityTable.$inferSelect;

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

export type UserActivities = Awaited<ReturnType<typeof getActivityLogs>>;
export type UserActivity = Awaited<ReturnType<typeof getUserActivities>>;
