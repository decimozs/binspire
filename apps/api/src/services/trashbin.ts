import type { IBaseService } from "@/lib/types";
import {
  TrashbinCollectionRepository,
  TrashbinRepository,
  TrashbinStatusRepository,
} from "@/repository";
import type {
  InsertTrashbin,
  InsertTrashbinCollection,
  InsertTrashbinStatus,
  Trashbin,
  TrashbinCollection,
  TrashbinStatus,
  UpdateTrashbin,
  UpdateTrashbinCollection,
  UpdateTrashbinStatus,
} from "@binspire/db/schema";
import { AuditService } from "./audit";
import { NotFoundError } from "@/features/error";

export class TrashbinService
  implements IBaseService<Trashbin, InsertTrashbin, UpdateTrashbin>
{
  private repo = new TrashbinRepository();
  private auditLogger = new AuditService();
  private trashbinStatus = new TrashbinStatusService();

  async create(data: InsertTrashbin, userId: string) {
    const [trashbin] = await this.repo.insert(data);

    if (!trashbin) throw new Error("Failed to create trashbin.");

    await this.trashbinStatus.create({
      trashbinId: trashbin.id,
    });

    await this.auditLogger.create({
      orgId: trashbin.orgId,
      userId,
      title: `Trashbin #${trashbin.name} Created`,
      entity: "trashbinManagement",
      action: "create",
      changes: {
        before: {},
        after: trashbin,
      },
    });

    return trashbin;
  }

  async findAll(orgId: string) {
    return await this.repo.readAll(orgId);
  }

  async findById(id: string) {
    const trashbin = await this.repo.readById(id);

    if (!trashbin) throw new NotFoundError("Trashbin not found.");

    return trashbin;
  }

  async update(id: string, data: UpdateTrashbin, userId: string) {
    const currentTrashbin = await this.repo.readById(id);

    if (!currentTrashbin) throw new NotFoundError("Trashbin not found.");

    const [updatedTrashbin] = await this.repo.patch(id, data);

    if (!updatedTrashbin) throw new Error("Failed to update trashbin.");

    await this.auditLogger.create({
      orgId: updatedTrashbin.orgId,
      userId,
      title: `Trashbin #${updatedTrashbin.no} Updated`,
      entity: "trashbinManagement",
      action: "update",
      changes: {
        before: currentTrashbin,
        after: updatedTrashbin,
      },
    });

    return updatedTrashbin;
  }

  async delete(id: string, userId: string) {
    const [trashbin] = await this.repo.delete(id);

    if (!trashbin) throw new NotFoundError("Trashbin not found.");

    await this.auditLogger.create({
      orgId: trashbin.orgId,
      userId,
      title: `Trashbin #${trashbin.no} Deleted`,
      entity: "trashbinManagement",
      action: "delete",
      changes: {
        before: trashbin,
        after: {},
      },
    });

    return trashbin;
  }

  async collect(id: string, data: InsertTrashbinCollection) {
    const [collected] = await this.repo.collect(id, data);

    if (!collected) throw new Error("Failed to collect trashbin.");

    return collected;
  }
}

export class TrashbinCollectionService
  implements
    IBaseService<
      TrashbinCollection,
      InsertTrashbinCollection,
      UpdateTrashbinCollection
    >
{
  private repo = new TrashbinCollectionRepository();
  private auditLogger = new AuditService();

  async create(data: InsertTrashbinCollection) {
    const wasteLevel = data.wasteLevel ?? 0;

    const [collection] = await this.repo.insert({
      isFull: wasteLevel > 98,
      ...data,
    });

    if (!collection) throw new Error("Failed to create trashbin collection.");

    await this.auditLogger.create({
      orgId: collection.orgId,
      userId: collection.collectedBy,
      title: `Trashbin Collection #${collection.no} Created`,
      entity: "collectionsManagement",
      action: "create",
      changes: {
        before: {},
        after: collection,
      },
    });

    return collection;
  }

  async findAll(orgId: string) {
    return await this.repo.readAll(orgId);
  }

  async findById(id: string) {
    const collection = await this.repo.readById(id);

    if (!collection) throw new NotFoundError("Trashbin collection not found.");

    return collection;
  }

  async findByTrashbinId(trashbinId: string) {
    const collection = await this.repo.readByTrashbinId(trashbinId);

    if (!collection) throw new NotFoundError("Trashbin collection not found.");

    return collection;
  }

  async findByUserId(userId: string) {
    return await this.repo.readByUserId(userId);
  }

  async update(id: string, data: UpdateTrashbinCollection, userId: string) {
    const currentCollection = await this.repo.readById(id);

    if (!currentCollection)
      throw new NotFoundError("Trashbin collection not found.");

    const [updatedCollection] = await this.repo.patch(id, data);

    if (!updatedCollection)
      throw new Error("Failed to update trashbin collection.");

    await this.auditLogger.create({
      orgId: updatedCollection.orgId,
      userId,
      title: `Trashbin Collection #${updatedCollection.no} Updated`,
      entity: "collectionsManagement",
      action: "update",
      changes: {
        before: currentCollection,
        after: updatedCollection,
      },
    });

    return updatedCollection;
  }

  async delete(id: string, userId: string) {
    const [collection] = await this.repo.delete(id);

    if (!collection) throw new NotFoundError("Trashbin collection not found.");

    await this.auditLogger.create({
      orgId: collection.orgId,
      userId,
      title: `Trashbin Collection #${collection.no} Deleted`,
      entity: "collectionsManagement",
      action: "delete",
      changes: {
        before: collection,
        after: {},
      },
    });

    return collection;
  }
}

export class TrashbinStatusService
  implements
    IBaseService<TrashbinStatus, InsertTrashbinStatus, UpdateTrashbinStatus>
{
  private repo = new TrashbinStatusRepository();

  async create(data: InsertTrashbinStatus) {
    const [status] = await this.repo.insert(data);

    if (!status) throw new Error("Failed to create trashbin status.");

    return status;
  }

  async findAll() {
    return await this.repo.readAll();
  }

  async findById(id: string) {
    const status = await this.repo.readById(id);

    if (!status) throw new NotFoundError("Trashbin status not found.");

    return status;
  }

  async findByTrashbinId(trashbinId: string) {
    const status = await this.repo.readByTrashbinId(trashbinId);

    if (!status) throw new NotFoundError("Trashbin status not found.");

    return status;
  }

  async update(id: string, data: UpdateTrashbinStatus) {
    const [status] = await this.repo.patch(id, data);

    if (!status) throw new Error("Trashbin status not found.");

    return status;
  }

  async delete(id: string) {
    const [status] = await this.repo.delete(id);

    if (!status) throw new NotFoundError("Trashbin status not found.");

    return status;
  }
}
