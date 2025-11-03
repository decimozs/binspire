import type { IBaseRepository } from "@/lib/types";
import { db, eq } from "@binspire/db";
import {
  qrCodesTable,
  type QrCode,
  type InsertQrCode,
  type UpdateQrCode,
} from "@binspire/db/schema";

export class QrCodeRepository
  implements IBaseRepository<QrCode, InsertQrCode, UpdateQrCode>
{
  private db = db;

  async insert(data: InsertQrCode) {
    return await this.db.insert(qrCodesTable).values(data).returning();
  }

  async readAll() {
    return await this.db.query.qrCodesTable.findMany({
      orderBy: (table, { desc }) => [desc(table.updatedAt)],
    });
  }

  async readById(id: string) {
    const qrCode = await this.db.query.qrCodesTable.findFirst({
      where: (table, { eq }) => eq(table.id, id),
    });

    return qrCode ?? null;
  }

  async readyBySecret(secret: string) {
    const qrCode = await this.db.query.qrCodesTable.findFirst({
      where: (table, { eq }) => eq(table.secret, secret),
    });

    return qrCode ?? null;
  }

  async patch(id: string, data: UpdateQrCode) {
    return await this.db
      .update(qrCodesTable)
      .set(data)
      .where(eq(qrCodesTable.id, id))
      .returning();
  }

  async delete(id: string) {
    return await this.db
      .delete(qrCodesTable)
      .where(eq(qrCodesTable.id, id))
      .returning();
  }
}
