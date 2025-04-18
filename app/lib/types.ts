import type { LucideIcon } from "lucide-react";
import type { requestAccessTable, sessionsTable, usersTable } from "@/db";

export type Session = typeof sessionsTable.$inferInsert;

export type VerificationType = "email-verification" | "forgot-password";

export type User = typeof usersTable.$inferSelect;

export type SessionData = Session & Pick<User, "permission">;

export interface Teams {
  name: string;
  icon: LucideIcon;
  onlines: string;
}

export type RequestAccess = typeof requestAccessTable.$inferSelect;
