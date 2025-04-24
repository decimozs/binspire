import type {
  requestAccessTable,
  sessionsTable,
  userActivityTable,
  userCommentTable,
  usersTable,
} from "@/db";
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

export type UserActivity = {
  id: string;
  userId: string;
  name: string;
  status: string;
  type: string;
  reason: string;
  createdAt: Date;
  updatedAt: Date;
  comments: {
    id: string;
    userId: string;
    activityId: string;
    message: string;
    createdAt: Date;
    updatedAt: Date;
    user: {
      name: string;
      image: string;
    };
    replies: {
      id: string;
      userId: string;
      commentId: string;
      message: string;
      createdAt: Date;
      updatedAt: Date;
      user: {
        name: string;
        image: string;
      };
    }[];
  }[];
};

export type UserComment = typeof userCommentTable.$inferSelect;
