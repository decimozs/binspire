import { boolean, pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { nanoid } from "nanoid";
import { verificationsTable } from "./auth";

export const organizationsTable = pgTable("organizations", {
  id: text("id")
    .$defaultFn(() => nanoid())
    .primaryKey(),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at")
    .notNull()
    .$onUpdate(() => new Date()),
});

export const usersTable = pgTable("users", {
  id: text("id")
    .$defaultFn(() => nanoid())
    .primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  emailVerified: boolean("email_verified").notNull(),
  permission: text("permission").notNull(),
  image: text("image"),
  orgId: text("org_id").references(() => organizationsTable.id, {
    onDelete: "cascade",
  }),
  role: text("role").notNull().default("user"),
  isOnline: boolean("is_online").notNull().default(false),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at")
    .notNull()
    .$onUpdate(() => new Date()),
});

export const requestAccessTable = pgTable("request_access", {
  id: text("id")
    .$defaultFn(() => nanoid())
    .primaryKey(),
  email: text("email").notNull(),
  name: text("name").notNull(),
  role: text("role").notNull(),
  phoneNumber: text("phone_number"),
  status: text("status").notNull(),
  reason: text("reason").notNull(),
  verificationId: text("verification_id")
    .references(() => verificationsTable.id, { onDelete: "cascade" })
    .notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at")
    .notNull()
    .$onUpdate(() => new Date()),
});
