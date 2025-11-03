import { UnauthorizedError } from "@/features/error";
import { VerificationRepository } from "@/repository";
import type { InsertVerification, Verification } from "@binspire/db/schema";

interface IVerificationService {
  verify(value: string): Promise<Verification>;
  verifyIdentifier(identifier: string): Promise<Verification>;
  create(data: InsertVerification): Promise<Verification>;
  delete(id: string): Promise<Verification>;
}

export class VerificationService implements IVerificationService {
  private repo = new VerificationRepository();

  async verify(value: string) {
    const verification = await this.repo.verify(value);

    if (!verification) throw new UnauthorizedError("Invalid verification.");

    const isExpired = new Date(verification.expiresAt) < new Date();

    if (isExpired) {
      await this.repo.delete(verification.id);
      throw new UnauthorizedError("Verification code has expired.");
    }

    return verification;
  }

  async verifyIdentifier(identifier: string) {
    const verification = await this.repo.verifyIdentifier(identifier);

    if (!verification) throw new UnauthorizedError("Invalid verification.");

    const isExpired = new Date(verification.expiresAt) < new Date();

    if (isExpired) {
      await this.repo.delete(verification.id);
      throw new UnauthorizedError("Verification code has expired.");
    }

    return verification;
  }

  async create(payload: InsertVerification) {
    const [data] = await this.repo.insert(payload);

    if (!data) throw new Error("Failed to create verification.");

    return data;
  }

  async delete(id: string) {
    const [data] = await this.repo.delete(id);

    if (!data) throw new Error("Verification not found.");

    return data;
  }
}
