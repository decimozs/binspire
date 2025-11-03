import type {
  InsertTrashbin,
  UpdateTrashbin,
  InsertTrashbinCollection,
} from "@binspire/db/schema";
import { rpc } from "../lib/api-client";

export class TrashbinApi {
  static async getAll() {
    const response = await rpc.api.trashbins.$get();
    return await response.json();
  }

  static async getById(id: string) {
    const response = await rpc.api.trashbins[":id"].$get({ param: { id } });
    return await response.json();
  }

  static async create(data: InsertTrashbin) {
    const response = await rpc.api.trashbins.create.$post({ json: data });

    if (!response.ok) throw new Error("Failed to create trashbin");

    return await response.json();
  }

  static async update(id: string, data: UpdateTrashbin) {
    const response = await rpc.api.trashbins.update[":id"].$patch({
      param: { id },
      json: data,
    });

    if (!response.ok) throw new Error("Failed to update trashbin");

    return await response.json();
  }

  static async delete(id: string) {
    const response = await rpc.api.trashbins.delete[":id"].$delete({
      param: { id },
    });

    if (!response.ok) throw new Error("Failed to delete trashbin");

    return await response.json();
  }

  static async collect(
    id: string,
    data: Pick<
      InsertTrashbinCollection,
      "wasteLevel" | "weightLevel" | "batteryLevel"
    >,
  ) {
    const response = await rpc.api.trashbins.collect[":id"].$post({
      param: { id },
      json: data,
    });

    if (!response.ok) throw new Error("Failed to collect trashbin");

    return await response.json();
  }
}

export class TrashbinCollectionsApi {
  static async getAll() {
    const response = await rpc.api["trashbins-collections"].$get();
    return await response.json();
  }

  static async getById(id: string) {
    const response = await rpc.api["trashbins-collections"][":id"].$get({
      param: { id },
    });

    return await response.json();
  }

  static async getByUserId(userId: string) {
    const response = await rpc.api["trashbins-collections"].user[":id"].$get({
      param: { id: userId },
    });

    return await response.json();
  }

  static async create(data: InsertTrashbinCollection) {
    const response = await rpc.api["trashbins-collections"].create.$post({
      json: data,
    });

    if (!response.ok) throw new Error("Failed to create trashbin collection");

    return await response.json();
  }

  static async delete(id: string) {
    const response = await rpc.api["trashbins-collections"].delete[
      ":id"
    ].$delete({
      param: { id },
    });

    if (!response.ok) throw new Error("Failed to delete trashbin collection");

    return await response.json();
  }
}

export type Trashbin = Awaited<ReturnType<typeof TrashbinApi.getById>>;

export type TrashbinCollections = Awaited<
  ReturnType<typeof TrashbinCollectionsApi.getAll>
>[number];
