import { boolean, pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { nanoid } from "nanoid";
import { createInsertSchema } from "drizzle-zod";
import type { z } from "zod";
import { usersTable } from "./user.schema.server";

export const trashbinsTable = pgTable("trashbins", {
  id: text("id")
    .$defaultFn(() => nanoid())
    .primaryKey(),
  name: text("name").notNull(),
  isActive: boolean("is_active").notNull().default(false),
  isCollected: boolean("is_collected").notNull().default(false),
  wasteStatus: text("waste_status").notNull().default("0"),
  weightStatus: text("weight_status").notNull().default("0"),
  batteryStatus: text("battery_status").notNull().default("0"),
  latitude: text("latitude").notNull(),
  longitude: text("longitude").notNull(),
  wasteLevel: text("waste_level").notNull().default("0"),
  weightLevel: text("weight_level").notNull().default("0"),
  batteryLevel: text("battery_level").notNull().default("0"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at")
    .notNull()
    .$onUpdate(() => new Date()),
});

export const createTrashbinSchema = createInsertSchema(trashbinsTable)
  .omit({
    id: true,
    createdAt: true,
    updatedAt: true,
  })
  .strict();
export const updateTrashbinSchema = createTrashbinSchema.partial();
export type CreateTrashbin = z.infer<typeof createTrashbinSchema>;
export type UpdateTrashbin = z.infer<typeof updateTrashbinSchema>;

export const trashbinsIssueTable = pgTable("trashbins_issues", {
  id: text("id")
    .$defaultFn(() => nanoid())
    .primaryKey(),
  userId: text("user_id")
    .references(() => usersTable.id, { onDelete: "cascade" })
    .notNull(),
  trashbinId: text("trashbin_id")
    .references(() => trashbinsTable.id, { onDelete: "cascade" })
    .notNull(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  status: text("status").notNull().default("ongoing"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at")
    .notNull()
    .$onUpdate(() => new Date()),
});

export const createTrashbinIssueSchema = createInsertSchema(trashbinsIssueTable)
  .omit({
    id: true,
    createdAt: true,
    updatedAt: true,
  })
  .strict();
export const updateTrashbinIssueSchema = createTrashbinIssueSchema
  .omit({
    userId: true,
    trashbinId: true,
  })
  .partial();
export type CreateTrashbinIssue = z.infer<typeof createTrashbinIssueSchema>;
export type UpdateTrashbinIssue = z.infer<typeof updateTrashbinIssueSchema>;

export const trashbinsCollectionTable = pgTable("trashbins_collections", {
  id: text("id")
    .$defaultFn(() => nanoid())
    .primaryKey(),
  userId: text("user_id")
    .references(() => usersTable.id, { onDelete: "cascade" })
    .notNull(),
  trashbinId: text("trashbin_id")
    .references(() => trashbinsTable.id, { onDelete: "cascade" })
    .notNull(),
  status: text("status").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at")
    .notNull()
    .$onUpdate(() => new Date()),
});

export const createTrashbinCollectionSchema = createInsertSchema(
  trashbinsCollectionTable,
).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});
export const updateTrashbinCollectionSchema = createTrashbinCollectionSchema
  .omit({
    userId: true,
    trashbinId: true,
  })
  .partial();
export type CreateTrashbinCollection = z.infer<
  typeof createTrashbinCollectionSchema
>;
export type UpdateTrashbinCollection = z.infer<
  typeof updateTrashbinCollectionSchema
>;
