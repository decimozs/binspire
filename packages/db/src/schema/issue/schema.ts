import { pgTable, text } from "drizzle-orm/pg-core";
import { nanoid } from "nanoid";
import { timestamps } from "../../lib/base";
import {
  ISSUE_STATUSES_ENUM,
  PRIORITY_SCORES_ENUM,
  SYSTEM_ENTITY_ENUM,
} from "../../lib/enum";
import { organizationsTable } from "../org";
import { usersTable } from "../user";

export const issuesTable = pgTable("issues", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => nanoid()),
  userId: text("user_id")
    .references(() => usersTable.id, { onDelete: "cascade" })
    .notNull(),
  orgId: text("org_id")
    .references(() => organizationsTable.id, { onDelete: "cascade" })
    .notNull(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  entity: SYSTEM_ENTITY_ENUM("entity").notNull(),
  priority: PRIORITY_SCORES_ENUM("priority").notNull().default("medium"),
  status: ISSUE_STATUSES_ENUM("status").notNull().default("open"),
  ...timestamps,
});
