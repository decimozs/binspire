import type { InsertHistory, UpdateHistory } from "@binspire/db/schema";
import { rpc } from "../lib/api-client";

export class HistoryApi {
  static async getAll() {
    const response = await rpc.api.history.$get();
    return response.json();
  }

  static async getById(id: string) {
    const response = await rpc.api.history[":id"].$get({
      param: { id },
    });

    return response.json();
  }

  static async create(data: InsertHistory) {
    const response = await rpc.api.history.create.$post({ json: data });

    if (!response.ok) throw new Error("Failed to create history");

    return response.json();
  }

  static async update(id: string, data: UpdateHistory) {
    const response = await rpc.api.history.update[":id"].$patch({
      param: { id },
      json: data,
    });

    if (!response.ok) throw new Error("Failed to update history");

    return response.json();
  }

  static async delete(id: string) {
    const response = await rpc.api.history.delete[":id"].$delete({
      param: { id },
    });

    if (!response.ok) throw new Error("Failed to delete history");

    return response.json();
  }
}

export type History = Awaited<ReturnType<typeof HistoryApi.getAll>>[number];
