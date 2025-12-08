import type {
  InsertUser,
  InsertUserCollectionAssignment,
  InsertUserGreenHeart,
  InsertUserInvitation,
  InsertUserQuota,
  InsertUserRequest,
  InsertUserSettings,
  InsertUserStatus,
  UpdateUser,
  UpdateUserGreenHeart,
  UpdateUserInvitation,
  UpdateUserQuota,
  UpdateUserRequest,
  UpdateUserSettings,
  UpdateUserStatus,
} from "@binspire/db/schema";
import { rpc } from "../lib/api-client";

export class UserApi {
  static async getAll() {
    const response = await rpc.api.users.$get();
    return response.json();
  }

  static async getById(id: string) {
    const response = await rpc.api.users[":id"].$get({ param: { id } });
    return response.json();
  }

  static async getByEmail(email: string) {
    const response = await rpc.api.users.email[":id"].$get({
      param: { id: email },
    });

    return response.json();
  }

  static async create(data: InsertUser) {
    const response = await rpc.api.users.create.$post({ json: data });

    if (!response.ok) throw new Error("Failed to create user");

    return response.json();
  }

  static async update(id: string, data: UpdateUser) {
    const response = await rpc.api.users.update[":id"].$patch({
      param: { id },
      json: data,
    });

    if (!response.ok) throw new Error("Failed to update user");

    return response.json();
  }

  static async delete(id: string) {
    const response = await rpc.api.users.delete[":id"].$delete({
      param: { id },
    });

    if (!response.ok) throw new Error("Failed to delete user");

    return response.json();
  }
}

export class UserInvitationsApi {
  static async getAll() {
    const response = await rpc.api["users-invitations"].$get();
    return response.json();
  }

  static async getById(id: string) {
    const response = await rpc.api["users-invitations"][":id"].$get({
      param: { id },
    });

    return response.json();
  }

  static async create(data: InsertUserInvitation) {
    const response = await rpc.api["users-invitations"].create.$post({
      json: data,
    });

    if (!response.ok) throw new Error("Failed to create user invitation");

    return response.json();
  }

  static async update(id: string, data: UpdateUserInvitation) {
    const response = await rpc.api["users-invitations"].update[":id"].$patch({
      param: { id },
      json: data,
    });

    if (!response.ok) throw new Error("Failed to update user invitation");

    return response.json();
  }

  static async delete(id: string) {
    const response = await rpc.api["users-invitations"].delete[":id"].$delete({
      param: { id },
    });

    if (!response.ok) throw new Error("Failed to delete user invitation");

    return response.json();
  }
}

export class UserRequestApi {
  static async getAll() {
    const response = await rpc.api["users-requests"].$get();
    return response.json();
  }

  static async getById(id: string) {
    const response = await rpc.api["users-requests"][":id"].$get({
      param: { id },
    });
    return response.json();
  }

  static async create(data: Omit<InsertUserRequest, "orgId">) {
    const response = await rpc.api["users-requests"].create.$post({
      json: data,
    });

    if (!response.ok) throw new Error("Failed to create user request");

    return response.json();
  }

  static async update(id: string, data: UpdateUserRequest) {
    const response = await rpc.api["users-requests"].update[":id"].$patch({
      param: { id },
      json: data,
    });

    if (!response.ok) throw new Error("Failed to update user request");

    return response.json();
  }

  static async delete(id: string) {
    const response = await rpc.api["users-requests"].delete[":id"].$delete({
      param: { id },
    });

    if (!response.ok) throw new Error("Failed to delete user request");

    return response.json();
  }
}

export class UserSettingsApi {
  static async getByUserId(userId: string) {
    const response = await rpc.api["users-settings"][":id"].$get({
      param: { id: userId },
    });

    return response.json();
  }

  static async create(data: InsertUserSettings) {
    const response = await rpc.api["users-settings"].create.$post({
      json: data,
    });

    if (!response.ok) throw new Error("Failed to create user settings");

    return response.json();
  }

  static async update(userId: string, data: UpdateUserSettings) {
    const response = await rpc.api["users-settings"].update[":id"].$patch({
      param: { id: userId },
      json: data,
    });

    if (!response.ok) throw new Error("Failed to update user settings");

    return response.json();
  }

  static async delete(userId: string) {
    const response = await rpc.api["users-settings"].delete[":id"].$delete({
      param: { id: userId },
    });

    if (!response.ok) throw new Error("Failed to delete user settings");

    return response.json();
  }
}

export class UserStatusApi {
  static async getByUserId(userId: string) {
    const response = await rpc.api["users-status"][":id"].$get({
      param: { id: userId },
    });

    return response.json();
  }

  static async create(data: InsertUserStatus) {
    const response = await rpc.api["users-status"].create.$post({
      json: data,
    });

    if (!response.ok) throw new Error("Failed to create user status");

    return response.json();
  }

  static async update(userId: string, data: UpdateUserStatus) {
    const response = await rpc.api["users-status"].update[":id"].$patch({
      param: { id: userId },
      json: data,
    });

    if (!response.ok) throw new Error("Failed to update user status");

    return response.json();
  }

  static async delete(userId: string) {
    const response = await rpc.api["users-status"].delete[":id"].$delete({
      param: { id: userId },
    });

    if (!response.ok) throw new Error("Failed to delete user status");

    return response.json();
  }
}

export class UserCollectionAssignmentApi {
  static async getAll() {
    const response = await rpc.api["users-collection-assignments"].$get();
    return response.json();
  }

  static async getById(id: string) {
    const response = await rpc.api["users-collection-assignments"][":id"].$get({
      param: { id },
    });
    return response.json();
  }

  static async getByUserId(userId: string) {
    const response = await rpc.api["users-collection-assignments"]["userId"][
      ":id"
    ].$get({
      param: { id: userId },
    });
    return response.json();
  }

  static async create(data: InsertUserCollectionAssignment) {
    const response = await rpc.api["users-collection-assignments"].create.$post(
      {
        json: data,
      },
    );

    if (!response.ok)
      throw new Error("Failed to create user collection assignment");

    return response.json();
  }

  static async delete(id: string) {
    const response = await rpc.api["users-collection-assignments"].delete[
      ":id"
    ].$delete({
      param: { id },
    });

    if (!response.ok)
      throw new Error("Failed to delete user collection assignment");

    return response.json();
  }
}

export class UserQuotaApi {
  static async getAll() {
    const response = await rpc.api["users-quota"].$get();
    return response.json();
  }

  static async getById(id: string) {
    const response = await rpc.api["users-quota"][":id"].$get({
      param: { id },
    });

    return response.json();
  }

  static async getByUserId(userId: string) {
    const response = await rpc.api["users-quota"]["userId"][":id"].$get({
      param: { id: userId },
    });

    return response.json();
  }

  static async create(data: InsertUserQuota) {
    const response = await rpc.api["users-quota"].create.$post({
      json: data,
    });

    if (!response.ok) throw new Error("Failed to create user quota");

    return response.json();
  }

  static async update(userId: string, data: UpdateUserQuota) {
    const response = await rpc.api["users-quota"].update[":id"].$patch({
      param: { id: userId },
      json: data,
    });

    if (!response.ok) throw new Error("Failed to update user quota");

    return response.json();
  }

  static async delete(userId: string) {
    const response = await rpc.api["users-quota"].delete[":id"].$delete({
      param: { id: userId },
    });

    if (!response.ok) throw new Error("Failed to delete user quota");

    return response.json();
  }
}

export class UserGreenHeartApi {
  static async getAll() {
    const response = await rpc.api["users-greenhearts"].$get();
    return response.json();
  }

  static async getByUserId(userId: string) {
    const response = await rpc.api["users-greenhearts"]["userId"][":id"].$get({
      param: { id: userId },
    });

    if (!response.ok) throw new Error("User green heart not found");

    return response.json();
  }

  static async getById(id: string) {
    const response = await rpc.api["users-greenhearts"][":id"].$get({
      param: { id },
    });

    if (!response.ok) throw new Error("User green heart not found");

    return response.json();
  }

  static async create(data: InsertUserGreenHeart) {
    const response = await rpc.api["users-greenhearts"].create.$post({
      json: data,
    });

    if (!response.ok) throw new Error("Failed to create user green heart");

    return response.json();
  }

  static async update(userId: string, data: UpdateUserGreenHeart) {
    const response = await rpc.api["users-greenhearts"].update[":id"].$patch({
      param: { id: userId },
      json: data,
    });

    if (!response.ok) throw new Error("Failed to update user green heart");

    return response.json();
  }

  static async delete(userId: string) {
    const response = await rpc.api["users-greenhearts"].delete[":id"].$delete({
      param: { id: userId },
    });

    if (!response.ok) throw new Error("Failed to delete user green heart");

    return response.json();
  }
}

export type User = Awaited<ReturnType<typeof UserApi.getAll>>[number];

export type UserInvitation = Awaited<
  ReturnType<typeof UserInvitationsApi.getById>
>;

export type UserRequest = Awaited<
  ReturnType<typeof UserRequestApi.getAll>
>[number];

export type UserStatus = Awaited<ReturnType<typeof UserStatusApi.getByUserId>>;

export type UserCollectionAssignment = Awaited<
  ReturnType<typeof UserCollectionAssignmentApi.getById>
>;

export type UserQuota = Awaited<ReturnType<typeof UserQuotaApi.getByUserId>>;

export type UserGreenHeart = Awaited<
  ReturnType<typeof UserGreenHeartApi.getByUserId>
>;
