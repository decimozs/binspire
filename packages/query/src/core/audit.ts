import type { InsertAudit, UpdateAudit } from "@binspire/db/schema";
import { rpc } from "../lib/api-client";

export class AuditApi {
  static async getAll() {
    const response = await rpc.api.audits.$get();
    return response.json();
  }

  static async getById(id: string) {
    const response = await rpc.api.audits[":id"].$get({
      param: { id },
    });

    return response.json();
  }

  static async create(data: InsertAudit) {
    const response = await rpc.api.audits.create.$post({ json: data });

    if (!response.ok) throw new Error("Failed to create audit");

    return response.json();
  }

  static async update(id: string, data: UpdateAudit) {
    const response = await rpc.api.audits.update[":id"].$patch({
      param: { id },
      json: data,
    });

    if (!response.ok) throw new Error("Failed to update audit");

    return response.json();
  }

  static async delete(id: string) {
    const response = await rpc.api.audits.delete[":id"].$delete({
      param: { id },
    });

    if (!response.ok) throw new Error("Failed to delete audit");

    return response.json();
  }
}

export type Audit = Awaited<ReturnType<typeof AuditApi.getAll>>[number];
