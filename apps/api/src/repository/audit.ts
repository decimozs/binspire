import { db, eq } from "@binspire/db";
import {
  type Audit,
  auditTable,
  type InsertAudit,
  type UpdateAudit,
} from "@binspire/db/schema";
import type { IBaseRepository } from "@/lib/types";

export class AuditRepository
  implements IBaseRepository<Audit, InsertAudit, UpdateAudit>
{
  private db = db;

  async insert(data: InsertAudit) {
    return await this.db.insert(auditTable).values(data).returning();
  }

  async readAll(orgId: string) {
    return await this.db.query.auditTable.findMany({
      where: (table, { eq }) => eq(table.orgId, orgId),
      with: {
        user: true,
      },
      orderBy: (table, { desc }) => [desc(table.updatedAt)],
    });
  }

  async readById(id: string) {
    const audit = await this.db.query.auditTable.findFirst({
      where: (table, { eq }) => eq(table.id, id),
      with: {
        user: true,
      },
    });

    return audit ?? null;
  }

  async patch(id: string, data: UpdateAudit) {
    return await this.db
      .update(auditTable)
      .set(data)
      .where(eq(auditTable.id, id))
      .returning();
  }

  async delete(id: string) {
    return await this.db
      .delete(auditTable)
      .where(eq(auditTable.id, id))
      .returning();
  }
}
