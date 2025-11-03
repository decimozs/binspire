import { NotFoundError } from "@/features/error";
import type { IBaseService } from "@/lib/types";
import { AuditRepository } from "@/repository/audit";
import type { Audit, InsertAudit, UpdateAudit } from "@binspire/db/schema";

export class AuditService
  implements IBaseService<Audit, InsertAudit, UpdateAudit>
{
  private repo = new AuditRepository();

  async create(data: InsertAudit) {
    const [audit] = await this.repo.insert(data);

    if (!audit) throw new Error("Failed to create audit.");

    return audit;
  }

  async findAll(orgId: string) {
    return await this.repo.readAll(orgId);
  }

  async findById(id: string) {
    const audit = await this.repo.readById(id);

    if (!audit) throw new NotFoundError("Audit not found.");

    return audit;
  }

  async update(id: string, data: UpdateAudit) {
    const [audit] = await this.repo.patch(id, data);

    if (!audit) throw new NotFoundError("Audit not found.");

    return audit;
  }

  async delete(id: string, userId: string) {
    const [audit] = await this.repo.delete(id);

    if (!audit) throw new NotFoundError("Audit not found.");

    await this.create({
      orgId: audit.orgId,
      userId,
      title: `Audit #${audit.no} Deleted`,
      entity: "activityManagement",
      action: "delete",
      changes: {
        before: audit,
        after: {},
      },
    });

    return audit;
  }
}
