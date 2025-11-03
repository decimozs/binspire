import { pgTable, text, boolean, jsonb, integer } from "drizzle-orm/pg-core";
import { nanoid } from "nanoid";
import { timestamps } from "../../lib/base";
import {
  INVITATION_STATUSES_ENUM,
  REQUEST_STATUSES_ENUM,
} from "../../lib/enum";
import { organizationsTable } from "../org/schema";
import { trashbinsTable } from "../trashbin";
import type { UserPermissionOpts, UserSettingsOpts } from "../../lib/types";

export const usersTable = pgTable("user", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => nanoid()),
  orgId: text("org_id")
    .references(() => organizationsTable.id)
    .notNull(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  emailVerified: boolean("email_verified")
    .$defaultFn(() => false)
    .notNull(),
  image: text("image"),
  ...timestamps,
});

export const userStatusTable = pgTable("user_status", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => nanoid()),
  userId: text("user_id")
    .references(() => usersTable.id, { onDelete: "cascade" })
    .notNull(),
  isOnline: boolean("is_online").default(false).notNull(),
  role: text("role").default("user").notNull(),
  permission: jsonb("permission")
    .$type<UserPermissionOpts>()
    .default({})
    .notNull(),
  lastActiveAt: text("last_active_at"),
  ...timestamps,
});

export const userSettingsTable = pgTable("user_settings", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => nanoid()),
  userId: text("user_id")
    .references(() => usersTable.id, { onDelete: "cascade" })
    .notNull(),

  settings: jsonb("settings")
    .$type<UserSettingsOpts>()
    .default({ appearance: { theme: "dark", font: "Manrope" } })
    .notNull(),
  ...timestamps,
});

export const userInvitationsTable = pgTable("user_invitations", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => nanoid())
    .notNull(),
  email: text("email").notNull(),
  orgId: text("org_id")
    .references(() => organizationsTable.id, { onDelete: "cascade" })
    .notNull(),
  userId: text("user_id")
    .references(() => usersTable.id, { onDelete: "cascade" })
    .notNull(),
  status: INVITATION_STATUSES_ENUM("status").notNull().default("pending"),
  role: text("role").notNull().default("not-set"),
  permission: text("permission").notNull().default("not-set"),
  ...timestamps,
});

export const usersRequestsTable = pgTable("user_requests", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => nanoid())
    .notNull(),
  userId: text("user_id")
    .references(() => usersTable.id, { onDelete: "cascade" })
    .notNull(),
  orgId: text("org_id")
    .references(() => organizationsTable.id, { onDelete: "cascade" })
    .notNull(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  status: REQUEST_STATUSES_ENUM("status").notNull().default("pending"),
  type: text("type").notNull(),
  ...timestamps,
});

export const userCollectionAssignmentsTable = pgTable(
  "user_collection_assignments",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => nanoid())
      .notNull(),
    userId: text("user_id")
      .references(() => usersTable.id, { onDelete: "cascade" })
      .notNull(),
    trashbinId: text("trashbin_id")
      .references(() => trashbinsTable.id)
      .notNull(),
    ...timestamps,
  },
);

export const userQuotaTable = pgTable("user_quota", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => nanoid())
    .notNull(),
  userId: text("user_id")
    .references(() => usersTable.id, { onDelete: "cascade" })
    .notNull(),
  used: integer("used").notNull().default(0),
  ...timestamps,
});

export const userGreenHeartsTable = pgTable("user_green_hearts", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => nanoid())
    .notNull(),
  userId: text("user_id")
    .references(() => usersTable.id, { onDelete: "cascade" })
    .notNull(),
  totalKg: integer("total_kg").notNull().default(0),
  points: integer("points").notNull().default(0),
  ...timestamps,
});
