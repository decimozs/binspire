import {
  verificationsTable,
  type InsertVerification,
} from "@binspire/db/schema";
import { db, eq } from "@binspire/db";

export class VerificationRepository {
  private db = db;

  async verify(value: string) {
    return await this.db.query.verificationsTable.findFirst({
      where: (table, { eq }) => eq(table.value, value),
    });
  }

  async verifyIdentifier(identifier: string) {
    return await this.db.query.verificationsTable.findFirst({
      where: (table, { eq }) => eq(table.identifier, identifier),
    });
  }

  async insert(data: InsertVerification) {
    return await this.db.insert(verificationsTable).values(data).returning();
  }

  async delete(id: string) {
    return await this.db
      .delete(verificationsTable)
      .where(eq(verificationsTable.id, id))
      .returning();
  }
}
