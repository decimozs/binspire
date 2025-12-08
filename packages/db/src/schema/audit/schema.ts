import { jsonb, pgTable, text } from "drizzle-orm/pg-core";
import { nanoid } from "nanoid";
import { timestamps } from "../../lib/base";
import { AUDIT_ACTIONS_ENUM, SYSTEM_ENTITY_ENUM } from "../../lib/enum";
import { organizationsTable } from "../org";
import { usersTable } from "../user";

export type AuditChange = {
  before: Record<string, unknown> | null;
  after: Record<string, unknown> | null;
};

export const auditTable = pgTable("audit", {
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
  action: AUDIT_ACTIONS_ENUM("action").notNull(),
  entity: SYSTEM_ENTITY_ENUM("entity").notNull(),
  changes: jsonb("changes")
    .$type<AuditChange>()
    .default({
      before: null,
      after: null,
    })
    .notNull(),
  ...timestamps,
});
