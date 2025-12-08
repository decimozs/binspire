import { boolean, pgTable, text } from "drizzle-orm/pg-core";
import { nanoid } from "nanoid";
import { timestamps } from "../../lib/base";
import { organizationsTable } from "../org";

export const maintenanceTable = pgTable("maintenance", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => nanoid()),
  orgId: text("org_id")
    .references(() => organizationsTable.id)
    .notNull(),
  isInMaintenance: boolean("is_in_maintenance").notNull().default(false),
  title: text("message"),
  description: text("description"),
  startTime: text("start_time"),
  endTime: text("end_time"),
  ...timestamps,
});
