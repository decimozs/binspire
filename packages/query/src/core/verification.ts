import type { InsertVerification } from "@binspire/db/schema";
import { rpc } from "../lib/api-client";

export class VerificationApi {
  static async verify(value: string) {
    const response = await rpc.api.verifications.verify.$post({
      json: {
        value,
      },
    });

    if (!response.ok) throw new Error("Failed to verify value");

    return response.json();
  }

  static async verifyIdentifier(identifier: string) {
    const response = await rpc.api.verifications["verify-identifier"].$post({
      json: {
        identifier,
      },
    });

    if (!response.ok) throw new Error("Failed to verify identifier");

    return response.json();
  }

  static async create(data: InsertVerification) {
    const response = await rpc.api.verifications.create.$post({ json: data });

    if (!response.ok) throw new Error("Failed to create verification");

    return response.json();
  }

  static async delete(id: string) {
    const response = await rpc.api.verifications.delete[":id"].$delete({
      param: { id },
    });

    if (!response.ok) throw new Error("Failed to delete verification");

    return response.json();
  }
}
