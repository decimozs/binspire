import { db, eq } from "@binspire/db";
import {
  type InsertTrashbin,
  type InsertTrashbinCollection,
  type InsertTrashbinStatus,
  type Trashbin,
  type TrashbinCollection,
  type TrashbinStatus,
  trashbinsCollectionsTable,
  trashbinsStatusTable,
  trashbinsTable,
  type UpdateTrashbin,
  type UpdateTrashbinCollection,
  type UpdateTrashbinStatus,
  userCollectionAssignmentsTable,
} from "@binspire/db/schema";
import type { IBaseRepository } from "@/lib/types";

export class TrashbinRepository
  implements IBaseRepository<Trashbin, InsertTrashbin, UpdateTrashbin>
{
  private db = db;

  async insert(data: InsertTrashbin) {
    return await this.db.insert(trashbinsTable).values(data).returning();
  }

  async readAll(orgId: string) {
    return await this.db.query.trashbinsTable.findMany({
      where: (table, { eq }) => eq(table.orgId, orgId),
      with: { status: true, collections: true },
    });
  }

  async readById(id: string) {
    const trashbin = await this.db.query.trashbinsTable.findFirst({
      where: (table, { eq }) => eq(table.id, id),
      with: { status: true, collections: true },
    });

    return trashbin ?? null;
  }

  async patch(id: string, data: UpdateTrashbin) {
    return await this.db
      .update(trashbinsTable)
      .set(data)
      .where(eq(trashbinsTable.id, id))
      .returning();
  }

  async delete(id: string) {
    return await this.db
      .delete(trashbinsTable)
      .where(eq(trashbinsTable.id, id))
      .returning();
  }

  async collect(id: string, data: InsertTrashbinCollection) {
    await this.db
      .update(trashbinsStatusTable)
      .set({
        isCollected: true,
        isScheduled: false,
        scheduledAt: null,
      })
      .where(eq(trashbinsStatusTable.trashbinId, id))
      .returning();

    await this.db
      .delete(userCollectionAssignmentsTable)
      .where(eq(userCollectionAssignmentsTable.trashbinId, id));

    return await this.db
      .insert(trashbinsCollectionsTable)
      .values(data)
      .returning();
  }
}

export class TrashbinCollectionRepository
  implements
    IBaseRepository<
      TrashbinCollection,
      InsertTrashbinCollection,
      UpdateTrashbinCollection
    >
{
  private db = db;

  async insert(data: InsertTrashbinCollection) {
    return await this.db
      .insert(trashbinsCollectionsTable)
      .values(data)
      .returning();
  }

  async readAll(orgId: string) {
    return await this.db.query.trashbinsCollectionsTable.findMany({
      where: (table, { eq }) => eq(table.orgId, orgId),
      with: {
        trashbin: true,
        collector: true,
      },
      orderBy: (table, { desc }) => [desc(table.createdAt)],
    });
  }

  async readById(id: string) {
    const collection = await this.db.query.trashbinsCollectionsTable.findFirst({
      where: (table, { eq }) => eq(table.id, id),
      with: { trashbin: true, collector: true },
    });

    return collection ?? null;
  }

  async readByUserId(userId: string) {
    return await this.db.query.trashbinsCollectionsTable.findMany({
      where: (table, { eq }) => eq(table.collectedBy, userId),
    });
  }

  async readByTrashbinId(trashbinId: string) {
    const collections = await this.db.query.trashbinsCollectionsTable.findMany({
      where: (table, { eq }) => eq(table.trashbinId, trashbinId),
      with: { trashbin: true, collector: true },
    });

    return collections ?? null;
  }

  async patch(id: string, data: UpdateTrashbinCollection) {
    return await this.db
      .update(trashbinsCollectionsTable)
      .set(data)
      .where(eq(trashbinsCollectionsTable.id, id))
      .returning();
  }

  async delete(id: string) {
    return await this.db
      .delete(trashbinsCollectionsTable)
      .where(eq(trashbinsCollectionsTable.id, id))
      .returning();
  }
}

export class TrashbinStatusRepository
  implements
    IBaseRepository<TrashbinStatus, InsertTrashbinStatus, UpdateTrashbinStatus>
{
  private db = db;

  async insert(data: InsertTrashbinStatus) {
    return await this.db.insert(trashbinsStatusTable).values(data).returning();
  }

  async readAll() {
    return await this.db.query.trashbinsStatusTable.findMany();
  }

  async readById(id: string) {
    const status = await this.db.query.trashbinsStatusTable.findFirst({
      where: (table, { eq }) => eq(table.id, id),
    });

    return status ?? null;
  }

  async readByTrashbinId(trashbinId: string) {
    const status = await this.db.query.trashbinsStatusTable.findFirst({
      where: (table, { eq }) => eq(table.trashbinId, trashbinId),
    });

    return status ?? null;
  }

  async patch(id: string, data: UpdateTrashbinStatus) {
    return await this.db
      .update(trashbinsStatusTable)
      .set(data)
      .where(eq(trashbinsStatusTable.trashbinId, id))
      .returning();
  }

  async delete(id: string) {
    return await this.db
      .delete(trashbinsStatusTable)
      .where(eq(trashbinsStatusTable.trashbinId, id))
      .returning();
  }
}
