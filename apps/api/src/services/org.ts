import type {
  InsertOrganization,
  InsertOrganizationSettings,
  Organization,
  OrganizationSettings,
  UpdateOrganization,
  UpdateOrganizationSettings,
} from "@binspire/db/schema";
import { NotFoundError } from "@/features/error";
import type { IBaseService } from "@/lib/types";
import {
  OrganizationRepository,
  OrganizationSettingsRepository,
} from "@/repository";

export class OrganizationService
  implements IBaseService<Organization, InsertOrganization, UpdateOrganization>
{
  private repo = new OrganizationRepository();

  async create(data: InsertOrganization) {
    const [organization] = await this.repo.insert(data);

    if (!organization) throw new Error("Failed to create organization.");

    return organization;
  }

  async findAll() {
    return await this.repo.readAll();
  }

  async findById(id: string) {
    const organization = await this.repo.readById(id);

    if (!organization) throw new NotFoundError("Organization not found.");

    return organization;
  }

  async update(id: string, data: UpdateOrganization) {
    const [organization] = await this.repo.patch(id, data);

    if (!organization) throw new Error("Organization not found.");

    return organization;
  }

  async delete(id: string) {
    const [organization] = await this.repo.delete(id);

    if (!organization) throw new NotFoundError("Organization not found.");

    return organization;
  }
}

export class OrganizationSettingsService
  implements
    IBaseService<
      OrganizationSettings,
      InsertOrganizationSettings,
      UpdateOrganizationSettings
    >
{
  private repo = new OrganizationSettingsRepository();

  async create(data: InsertOrganizationSettings) {
    const [setting] = await this.repo.insert(data);

    if (!setting) throw new Error("Failed to create organization setting.");

    return setting;
  }

  async findAll() {
    return await this.repo.readAll();
  }

  async findById(id: string) {
    const setting = await this.repo.readById(id);

    if (!setting) throw new NotFoundError("Organization setting not found.");

    return setting;
  }

  async findByOrganizationId(organizationId: string) {
    const settings = await this.repo.readByOrgId(organizationId);

    if (!settings)
      throw new NotFoundError("Organization settings not found for this org.");

    return settings;
  }

  async update(id: string, data: UpdateOrganizationSettings) {
    const [setting] = await this.repo.patch(id, data);

    if (!setting) throw new NotFoundError("Organization setting not found.");

    return setting;
  }

  async updateSecret(orgId: string, secret: string) {
    const [setting] = await this.repo.patchSecret(orgId, secret);

    if (!setting) throw new NotFoundError("Organization setting not found.");

    return setting;
  }

  async delete(id: string) {
    const [setting] = await this.repo.delete(id);

    if (!setting) throw new NotFoundError("Organization setting not found.");

    return setting;
  }
}
