import { pgTable, text, timestamp, index } from "drizzle-orm/pg-core";
import { nanoid } from "nanoid";
import { organizationsTable, usersTable } from "./user.schema.server";
import { createInsertSchema } from "drizzle-zod";
import type { z } from "zod";

export const sessionsTable = pgTable(
  "sessions",
  {
    id: text("id").notNull().primaryKey(),
    expiresAt: timestamp("expires_at").notNull(),
    token: text("token").notNull().unique(),
    ipAddress: text("ip_address"),
    userAgent: text("user_agent"),
    role: text("role").default("default"),
    userId: text("user_id")
      .references(() => usersTable.id, { onDelete: "cascade" })
      .notNull(),
    orgId: text("org_id").references(() => organizationsTable.id, {
      onDelete: "cascade",
    }),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at")
      .notNull()
      .$onUpdate(() => new Date()),
  },
  (table) => ({
    userIdIdx: index("idx_sessions_user_id").on(table.userId),
    tokenIdx: index("idx_sessions_token").on(table.token),
  }),
);

export const accountsTable = pgTable(
  "accounts",
  {
    id: text("id")
      .$defaultFn(() => nanoid())
      .primaryKey(),
    accountId: text("account_id").notNull(),
    providerId: text("provider_id").notNull(),
    userId: text("user_id")
      .notNull()
      .references(() => usersTable.id, { onDelete: "cascade" }),
    accessToken: text("access_token"),
    refreshToken: text("refresh_token"),
    idToken: text("id_token"),
    accessTokenExpiresAt: timestamp("access_token_expires_at"),
    refreshTokenExpiresAt: timestamp("refresh_token_expires_at"),
    scope: text("scope"),
    password: text("password"),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at")
      .notNull()
      .$onUpdate(() => new Date()),
  },
  (table) => ({
    userIdIdx: index("idx_accounts_user_id").on(table.userId),
    accountProviderIdx: index("idx_account_provider").on(
      table.accountId,
      table.providerId,
    ),
  }),
);

export const verificationsTable = pgTable(
  "verifications",
  {
    id: text("id")
      .$defaultFn(() => nanoid())
      .primaryKey(),
    identifier: text("identifier").notNull(),
    value: text("value").notNull(),
    expiresAt: timestamp("expires_at")
      .$defaultFn(() => new Date(Date.now() + 10 * 60 * 1000))
      .notNull(),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at")
      .notNull()
      .$onUpdate(() => new Date()),
  },
  (table) => ({
    identifierIdx: index("idx_verifications_identifier").on(table.identifier),
  }),
);

export const createAccountSchema = createInsertSchema(accountsTable)
  .omit({
    id: true,
    createdAt: true,
    updatedAt: true,
  })
  .strict();

export const updateAccountSchema = createAccountSchema.partial();

export type CreateAccount = z.infer<typeof createAccountSchema>;
export type UpdateAccount = z.infer<typeof updateAccountSchema>;
