import type { sessionsTable } from "~/db";

export type SessionData = typeof sessionsTable.$inferInsert;

export type VerificationType = "email-verification" | "forgot-password";
