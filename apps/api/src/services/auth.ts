import { NotFoundError } from "@/features/error";
import type { IBaseService } from "@/lib/types";
import { QrCodeRepository } from "@/repository/auth";
import type { QrCode, InsertQrCode, UpdateQrCode } from "@binspire/db/schema";

export class QrCodeService
  implements IBaseService<QrCode, InsertQrCode, UpdateQrCode>
{
  private repo = new QrCodeRepository();

  async create(data: InsertQrCode) {
    const [qrCode] = await this.repo.insert(data);

    if (!qrCode) throw new Error("Failed to create QR code.");

    return qrCode;
  }

  async findAll() {
    return await this.repo.readAll();
  }

  async findById(id: string) {
    const qrCode = await this.repo.readById(id);

    if (!qrCode) throw new NotFoundError("QR code not found.");

    return qrCode;
  }

  async findBySecret(secret: string) {
    const qrCode = await this.repo.readyBySecret(secret);

    if (!qrCode) throw new NotFoundError("QR code not found.");

    return qrCode;
  }

  async update(id: string, data: UpdateQrCode) {
    const [qrCode] = await this.repo.patch(id, data);

    if (!qrCode) throw new NotFoundError("QR code not found.");

    return qrCode;
  }

  async delete(id: string) {
    const [qrCode] = await this.repo.delete(id);

    if (!qrCode) throw new NotFoundError("QR code not found.");

    return qrCode;
  }
}
