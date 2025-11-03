import {
  boolean,
  integer,
  pgTable,
  doublePrecision,
  text,
  timestamp,
} from "drizzle-orm/pg-core";
import { nanoid } from "nanoid";
import { timestamps } from "../../lib/base";
import { usersTable } from "../user";
import { organizationsTable } from "../org";

export const trashbinsTable = pgTable("trashbin", {
  id: text("id")
    .$defaultFn(() => nanoid())
    .primaryKey(),
  orgId: text("org_id")
    .references(() => organizationsTable.id, { onDelete: "cascade" })
    .notNull(),
  name: text("name").notNull(),
  location: text("location").notNull(),
  department: text("department").notNull().default("general"),
  latitude: doublePrecision("latitude"),
  longitude: doublePrecision("longitude"),
  wasteType: text("waste_type").notNull(),
  ...timestamps,
});

export const trashbinsStatusTable = pgTable("trashbin_status", {
  id: text("id")
    .$defaultFn(() => nanoid())
    .primaryKey(),
  trashbinId: text("trashbin_id")
    .references(() => trashbinsTable.id, { onDelete: "cascade" })
    .notNull(),
  isOperational: boolean("is_operational").notNull().default(false),
  isArchived: boolean("is_archived").notNull().default(false),
  isCollected: boolean("is_collected").notNull().default(false),
  isScheduled: boolean("is_scheduled").notNull().default(false),
  scheduledAt: timestamp("scheduled_at"),
  ...timestamps,
});

export const trashbinsCollectionsTable = pgTable("trashbin_collections", {
  id: text("id")
    .$defaultFn(() => nanoid())
    .primaryKey(),
  orgId: text("org_id")
    .references(() => organizationsTable.id, { onDelete: "cascade" })
    .notNull(),
  trashbinId: text("trashbin_id")
    .references(() => trashbinsTable.id, { onDelete: "cascade" })
    .notNull(),
  collectedBy: text("collected_by")
    .references(() => usersTable.id, {
      onDelete: "cascade",
    })
    .notNull(),
  weightLevel: doublePrecision("weight_level"),
  wasteLevel: integer("waste_level"),
  batteryLevel: integer("battery_level"),
  isFull: boolean("is_full").default(false),
  isArchive: boolean("is_archive").notNull().default(false),
  ...timestamps,
});
