import type { IBaseRepository } from "@/lib/types";
import { db, eq } from "@binspire/db";
import {
  historyTable,
  type History,
  type InsertHistory,
  type UpdateHistory,
} from "@binspire/db/schema";

export class HistoryRepository
  implements IBaseRepository<History, InsertHistory, UpdateHistory>
{
  private db = db;

  async insert(data: InsertHistory) {
    return await this.db.insert(historyTable).values(data).returning();
  }

  async readAll(orgId: string) {
    return await this.db.query.historyTable.findMany({
      with: {
        user: true,
      },
      where: (table, { eq }) => eq(table.orgId, orgId),
      orderBy: (table, { desc }) => [desc(table.createdAt)],
    });
  }

  async readById(id: string) {
    const history = await this.db.query.historyTable.findFirst({
      with: {
        user: true,
      },
      where: (table, { eq }) => eq(table.id, id),
    });

    return history ?? null;
  }

  async patch(id: string, data: UpdateHistory) {
    return await this.db
      .update(historyTable)
      .set(data)
      .where(eq(historyTable.id, id))
      .returning();
  }

  async delete(id: string) {
    return await this.db
      .delete(historyTable)
      .where(eq(historyTable.id, id))
      .returning();
  }
}
