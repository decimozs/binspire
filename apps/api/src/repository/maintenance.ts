import type { IBaseRepository } from "@/lib/types";
import { db, eq } from "@binspire/db";
import {
  maintenanceTable,
  type Maintenance,
  type InsertMaintenance,
  type UpdateMaintenance,
} from "@binspire/db/schema";

export class MaintenanceRepository
  implements IBaseRepository<Maintenance, InsertMaintenance, UpdateMaintenance>
{
  private db = db;

  async insert(data: InsertMaintenance) {
    return await this.db.insert(maintenanceTable).values(data).returning();
  }

  async readAll(orgId: string) {
    return await this.db.query.maintenanceTable.findMany({
      where: (table, { eq }) => eq(table.orgId, orgId),
      orderBy: (table, { desc }) => [desc(table.updatedAt)],
    });
  }

  async readById(id: string) {
    const maintenance = await this.db.query.maintenanceTable.findFirst({
      where: (table, { eq }) => eq(table.orgId, id),
    });

    return maintenance ?? null;
  }

  async patch(id: string, data: UpdateMaintenance) {
    return await this.db
      .update(maintenanceTable)
      .set(data)
      .where(eq(maintenanceTable.orgId, id))
      .returning();
  }

  async delete(id: string) {
    return await this.db
      .delete(maintenanceTable)
      .where(eq(maintenanceTable.id, id))
      .returning();
  }
}
