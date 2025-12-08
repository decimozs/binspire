import { db, eq } from "@binspire/db";
import {
  type InsertOrganization,
  type InsertOrganizationSettings,
  type Organization,
  type OrganizationSettings,
  organizationSettingsTable,
  organizationsTable,
  type UpdateOrganization,
  type UpdateOrganizationSettings,
} from "@binspire/db/schema";
import type { IBaseRepository } from "@/lib/types";

export class OrganizationRepository
  implements
    IBaseRepository<Organization, InsertOrganization, UpdateOrganization>
{
  private db = db;

  async insert(data: InsertOrganization) {
    return await this.db.insert(organizationsTable).values(data).returning();
  }

  async readAll() {
    return await this.db.query.organizationsTable.findMany();
  }

  async readById(id: string) {
    const organization = await this.db.query.organizationsTable.findFirst({
      where: (table, { eq }) => eq(table.id, id),
    });

    return organization ?? null;
  }

  async patch(id: string, data: UpdateOrganization) {
    return await this.db
      .update(organizationsTable)
      .set(data)
      .where(eq(organizationsTable.id, id))
      .returning();
  }

  async delete(id: string) {
    return await this.db
      .delete(organizationsTable)
      .where(eq(organizationsTable.id, id))
      .returning();
  }
}

export class OrganizationSettingsRepository
  implements
    IBaseRepository<
      OrganizationSettings,
      InsertOrganizationSettings,
      UpdateOrganizationSettings
    >
{
  private db = db;

  async insert(data: InsertOrganizationSettings) {
    return await this.db
      .insert(organizationSettingsTable)
      .values(data)
      .returning();
  }

  async readAll() {
    return await this.db.query.organizationSettingsTable.findMany();
  }

  async readById(id: string) {
    const setting = await this.db.query.organizationSettingsTable.findFirst({
      where: (table, { eq }) => eq(table.id, id),
    });

    return setting ?? null;
  }

  async readByOrgId(orgId: string) {
    const setting = await this.db.query.organizationSettingsTable.findFirst({
      where: (table, { eq }) => eq(table.organizationId, orgId),
    });

    return setting ?? null;
  }

  async patch(orgId: string, data: UpdateOrganizationSettings) {
    return await this.db
      .update(organizationSettingsTable)
      .set(data)
      .where(eq(organizationSettingsTable.organizationId, orgId))
      .returning();
  }

  async patchSecret(orgId: string, secret: string) {
    return await this.db
      .update(organizationSettingsTable)
      .set({ secret })
      .where(eq(organizationSettingsTable.organizationId, orgId))
      .returning();
  }

  async delete(id: string) {
    return await this.db
      .delete(organizationSettingsTable)
      .where(eq(organizationSettingsTable.id, id))
      .returning();
  }
}
