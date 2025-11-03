import { jsonb, pgTable, text } from "drizzle-orm/pg-core";
import { nanoid } from "nanoid";
import { timestamps } from "../../lib/base";
import type { OrganizationSettingsOpts } from "../../lib/types";

export const organizationsTable = pgTable("organization", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => nanoid()),
  name: text("name").notNull(),
  slug: text("slug").notNull(),
  email: text("email").notNull().unique(),
  ...timestamps,
});

export const organizationSettingsTable = pgTable("organization_settings", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => nanoid()),
  organizationId: text("organization_id")
    .references(() => organizationsTable.id)
    .notNull(),
  secret: text("secret"),
  settings: jsonb("settings")
    .$type<OrganizationSettingsOpts>()
    .default({
      general: {
        wasteLevelThreshold: "80",
        location: {
          lat: 40,
          lng: -100,
        },
      },
      backup: {
        autoBackup: true,
        backupFrequency: "weekly",
      },
    }),
  ...timestamps,
});
