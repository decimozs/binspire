import type { UpdateOrganization } from "@binspire/db/schema";
import { rpc } from "../lib/api-client";
import type { OrganizationSettingsOpts } from "@binspire/shared";

export class OrganizationApi {
  static async getAll() {
    const response = await rpc.api.organizations.$get();
    return await response.json();
  }

  static async getById(id: string) {
    const response = await rpc.api.organizations[":id"].$get({ param: { id } });
    return await response.json();
  }

  static async update(id: string, data: UpdateOrganization) {
    const response = await rpc.api.organizations.update[":id"].$patch({
      param: { id },
      json: data,
    });

    if (!response.ok) throw new Error("Failed to update organization");

    return await response.json();
  }
}

export class OrganizationSettingsApi {
  static async getByOrgId(orgId: string) {
    const response = await rpc.api["organizations-settings"][":id"].$get({
      param: { id: orgId },
    });
    return await response.json();
  }

  static async update(orgId: string, settings: OrganizationSettingsOpts) {
    const response = await rpc.api["organizations-settings"].update[
      ":id"
    ].$patch({
      param: { id: orgId },
      json: { settings },
    });

    if (!response.ok) throw new Error("Failed to update organization settings");

    return await response.json();
  }

  static async updateSecret(orgId: string, secret: string) {
    const response = await rpc.api["organizations-settings"]["update-secret"][
      ":id"
    ].$patch({
      param: { id: orgId },
      json: { secret },
    });

    if (!response.ok) throw new Error("Failed to update organization secret");

    return await response.json();
  }
}

export type Organization = Awaited<ReturnType<typeof OrganizationApi.getById>>;

export type OrganizationSettings = Awaited<
  ReturnType<typeof OrganizationSettingsApi.getByOrgId>
>;
