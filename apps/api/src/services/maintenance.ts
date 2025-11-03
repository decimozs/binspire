import { NotFoundError } from "@/features/error";
import type { IBaseService } from "@/lib/types";
import { MaintenanceRepository } from "@/repository/maintenance";
import type {
  Maintenance,
  InsertMaintenance,
  UpdateMaintenance,
} from "@binspire/db/schema";
import { AuditService } from "./audit";
import { HistoryService } from "./history";

export class MaintenanceService
  implements IBaseService<Maintenance, InsertMaintenance, UpdateMaintenance>
{
  private repo = new MaintenanceRepository();
  private auditLogger = new AuditService();
  private historyService = new HistoryService();

  async create(data: InsertMaintenance, userId: string) {
    const [maintenance] = await this.repo.insert(data);

    if (!maintenance) throw new Error("Failed to create maintenance.");

    await this.auditLogger.create({
      orgId: maintenance.orgId,
      userId,
      title: `Maintenance #${maintenance.no} Created`,
      entity: "dashboardManagement",
      action: "create",
    });

    await this.historyService.create({
      orgId: maintenance.orgId,
      userId,
      title: `Maintenance #${maintenance.no} Enabled`,
      entity: "dashboardManagement",
    });

    return maintenance;
  }

  async findAll(orgId: string) {
    return await this.repo.readAll(orgId);
  }

  async findById(id: string) {
    const maintenance = await this.repo.readById(id);

    if (!maintenance) throw new NotFoundError("Maintenance not found.");

    return maintenance;
  }

  async update(id: string, data: UpdateMaintenance, userId: string) {
    const [maintenance] = await this.repo.patch(id, data);

    if (!maintenance) throw new NotFoundError("Maintenance not found.");

    await this.auditLogger.create({
      orgId: maintenance.orgId,
      userId,
      title: `Maintenance #${maintenance.no} Updated`,
      entity: "dashboardManagement",
      action: "update",
    });

    if (data.isInMaintenance === false) {
      await this.historyService.create({
        orgId: maintenance.orgId,
        userId,
        title: `Maintenance #${maintenance.no} Disabled`,
        entity: "dashboardManagement",
      });
    }

    return maintenance;
  }

  async delete(id: string, userId: string) {
    const [maintenance] = await this.repo.delete(id);

    if (!maintenance) throw new NotFoundError("Maintenance not found.");

    await this.auditLogger.create({
      orgId: maintenance.orgId,
      userId,
      title: `Maintenance #${maintenance.no} Deleted`,
      entity: "dashboardManagement",
      action: "delete",
    });

    await this.historyService.create({
      orgId: maintenance.orgId,
      userId,
      title: `Maintenance #${maintenance.no} Disabled`,
      entity: "dashboardManagement",
    });

    return maintenance;
  }
}
