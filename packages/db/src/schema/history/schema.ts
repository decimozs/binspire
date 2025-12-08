import { pgTable, text } from "drizzle-orm/pg-core";
import { nanoid } from "nanoid";
import { timestamps } from "../../lib/base";
import { SYSTEM_ENTITY_ENUM } from "../../lib/enum";
import { organizationsTable } from "../org";
import { usersTable } from "../user";

export const historyTable = pgTable("history", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => nanoid()),
  orgId: text("org_id")
    .references(() => organizationsTable.id, { onDelete: "cascade" })
    .notNull(),
  userId: text("user_id")
    .references(() => usersTable.id, { onDelete: "cascade" })
    .notNull(),
  title: text("title").notNull(),
  entity: SYSTEM_ENTITY_ENUM("entity").notNull(),
  ...timestamps,
});
