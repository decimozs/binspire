import type { InsertIssue, UpdateIssue } from "@binspire/db/schema";
import { rpc } from "../lib/api-client";

export class IssueApi {
  static async getAll() {
    const response = await rpc.api.issues.$get();
    return response.json();
  }

  static async getById(id: string) {
    const response = await rpc.api.issues[":id"].$get({
      param: { id },
    });

    return response.json();
  }

  static async create(data: InsertIssue) {
    const response = await rpc.api.issues.create.$post({ json: data });

    if (!response.ok) throw new Error("Failed to create issue");

    return response.json();
  }

  static async update(id: string, data: UpdateIssue) {
    const response = await rpc.api.issues.update[":id"].$patch({
      param: { id },
      json: data,
    });

    if (!response.ok) throw new Error("Failed to update issue");

    return response.json();
  }

  static async delete(id: string) {
    const response = await rpc.api.issues.delete[":id"].$delete({
      param: { id },
    });

    if (!response.ok) throw new Error("Failed to delete issue");

    return response.json();
  }
}

export type Issue = Awaited<ReturnType<typeof IssueApi.getAll>>[number];
