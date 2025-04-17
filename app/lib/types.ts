import type { sessionsTable } from "~/db";

export type SessionData = typeof sessionsTable.$inferInsert;

export type VerificationType = "email-verification" | "forgot-password";

export interface GoogleToken {
  token: {
    token: string;
    expires_in: number;
  };
}

export interface GoogleUser {
  id: string;
  email: string;
  verified_email: boolean;
  name: string;
  given_name: string;
  family_name: string;
  picture: string;
  locale: string;
}
