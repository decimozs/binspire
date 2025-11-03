import type { InsertMaintenance, UpdateMaintenance } from "@binspire/db/schema";
import { rpc } from "../lib/api-client";

export class MaintenanceApi {
  static async getAll() {
    const response = await rpc.api.maintenance.$get();
    return response.json();
  }

  static async getById(id: string) {
    const response = await rpc.api.maintenance[":id"].$get({
      param: { id },
    });

    return response.json();
  }

  static async create(data: InsertMaintenance) {
    const response = await rpc.api.maintenance.create.$post({ json: data });

    if (!response.ok) throw new Error("Failed to create maintenance");

    return response.json();
  }

  static async update(id: string, data: UpdateMaintenance) {
    const response = await rpc.api.maintenance.update[":id"].$patch({
      param: { id },
      json: data,
    });

    if (!response.ok) throw new Error("Failed to update maintenance");

    return response.json();
  }

  static async delete(id: string) {
    const response = await rpc.api.maintenance.delete[":id"].$delete({
      param: { id },
    });

    if (!response.ok) throw new Error("Failed to delete maintenance");

    return response.json();
  }
}

export type Maintenance = Awaited<ReturnType<typeof MaintenanceApi.getById>>;
