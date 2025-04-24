import { boolean, pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { nanoid } from "nanoid";
import { verificationsTable } from "./auth";
import { relations } from "drizzle-orm";

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

export const userActivityTable = pgTable("user_activity", {
  id: text("id")
    .$defaultFn(() => nanoid())
    .primaryKey(),
  userId: text("user_id")
    .references(() => usersTable.id, { onDelete: "cascade" })
    .notNull(),
  name: text("name").notNull(),
  status: text("status").notNull(),
  type: text("type").notNull(),
  reason: text("reason").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at")
    .notNull()
    .$onUpdate(() => new Date()),
});

export const userCommentTable = pgTable("user_comment", {
  id: text("id")
    .$defaultFn(() => nanoid())
    .primaryKey(),
  userId: text("user_id")
    .references(() => usersTable.id, { onDelete: "cascade" })
    .notNull(),
  activityId: text("activity_id")
    .references(() => userActivityTable.id, { onDelete: "cascade" })
    .notNull(),
  message: text("message").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at")
    .notNull()
    .$onUpdate(() => new Date()),
});

export const userReplyTable = pgTable("user_reply", {
  id: text("id")
    .$defaultFn(() => nanoid())
    .primaryKey(),
  userId: text("user_id")
    .references(() => usersTable.id, { onDelete: "cascade" })
    .notNull(),
  commentId: text("comment_id")
    .references(() => userCommentTable.id, { onDelete: "cascade" })
    .notNull(),
  message: text("message").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at")
    .notNull()
    .$onUpdate(() => new Date()),
});

export const userActivityRelations = relations(
  userActivityTable,
  ({ one, many }) => ({
    user: one(usersTable, {
      fields: [userActivityTable.userId],
      references: [usersTable.id],
    }),
    comments: many(userCommentTable),
  }),
);

export const userCommentRelations = relations(
  userCommentTable,
  ({ one, many }) => ({
    user: one(usersTable, {
      fields: [userCommentTable.userId],
      references: [usersTable.id],
    }),
    activity: one(userActivityTable, {
      fields: [userCommentTable.activityId],
      references: [userActivityTable.id],
    }),
    replies: many(userReplyTable),
  }),
);

export const userReplyRelations = relations(userReplyTable, ({ one }) => ({
  user: one(usersTable, {
    fields: [userReplyTable.userId],
    references: [usersTable.id],
  }),
  comment: one(userCommentTable, {
    fields: [userReplyTable.commentId],
    references: [userCommentTable.id],
  }),
}));
