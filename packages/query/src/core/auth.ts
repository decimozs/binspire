import type { InsertQrCode, UpdateQrCode } from "@binspire/db/schema";
import { rpc } from "../lib/api-client";

export class QRCodeApi {
  static async getAll() {
    const response = await rpc.api["qr-code"].$get();
    return response.json();
  }

  static async getById(id: string) {
    const response = await rpc.api["qr-code"][":id"].$get({
      param: { id },
    });

    return response.json();
  }

  static async getBySecret(secret: string) {
    const response = await rpc.api["qr-code"].secret[":id"].$get({
      param: { id: secret },
    });

    return response.json();
  }

  static async create(data: InsertQrCode) {
    const response = await rpc.api["qr-code"].create.$post({ json: data });

    if (!response.ok) throw new Error("Failed to create QR code");

    return response.json();
  }

  static async update(id: string, data: UpdateQrCode) {
    const response = await rpc.api["qr-code"].update[":id"].$patch({
      param: { id },
      json: data,
    });

    if (!response.ok) throw new Error("Failed to update QR code");

    return response.json();
  }

  static async delete(id: string) {
    const response = await rpc.api["qr-code"].delete[":id"].$delete({
      param: { id },
    });

    if (!response.ok) throw new Error("Failed to delete QR code");

    return response.json();
  }
}

export type QRCode = Awaited<ReturnType<typeof QRCodeApi.getById>>;
