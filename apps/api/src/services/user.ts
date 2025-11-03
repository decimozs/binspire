import { NotFoundError } from "@/features/error";
import type { IBaseService } from "@/lib/types";
import {
  UserGreenHeartRepository,
  UserInvitationRepository,
  UserRepository,
  UserRequestRepository,
  UserSettingsRepository,
  UserStatusRepository,
  UserCollectionAssignmentRepository,
  UserQuotaRepository,
} from "@/repository";
import type {
  InsertUserGreenHeart,
  InsertUser,
  InsertUserQuota,
  InsertUserInvitation,
  InsertUserRequest,
  InsertUserSettings,
  InsertUserStatus,
  InsertUserCollectionAssignment,
  UpdateUserGreenHeart,
  UpdateUser,
  UpdateUserQuota,
  UpdateUserInvitation,
  UpdateUserRequest,
  UpdateUserSettings,
  UpdateUserStatus,
  UpdateUserCollectionAssignment,
  User,
  UserGreenHeart,
  UserInvitation,
  UserRequest,
  UserSettings,
  UserStatus,
  UserCollectionAssignment,
  UserQuota,
} from "@binspire/db/schema";
import { AuditService } from "./audit";
import { MessagingService } from "./messaging";
import { db } from "@binspire/db";
import { TrashbinService } from "./trashbin";

export class UserService implements IBaseService<User, InsertUser, UpdateUser> {
  private repo = new UserRepository();
  private auditLogger = new AuditService();

  async create(data: InsertUser, userId: string) {
    const [user] = await this.repo.insert(data);

    if (!user) throw new Error("Failed to create user.");

    await this.auditLogger.create({
      orgId: user.orgId,
      userId,
      title: `User #${user.no} Created`,
      entity: "userManagement",
      action: "create",
      changes: {
        before: {},
        after: user,
      },
    });

    return user;
  }

  async findAll(orgId: string) {
    return await this.repo.readAll(orgId);
  }

  async findById(id: string) {
    const user = await this.repo.readById(id);

    if (!user) throw new NotFoundError("User not found.");

    return user;
  }

  async findByEmail(email: string) {
    const user = await this.repo.readByEmail(email);

    if (!user) throw new NotFoundError("User not found.");

    return user;
  }

  async update(id: string, data: UpdateUser, userId: string) {
    const currentUser = await this.repo.readById(id);

    if (!currentUser) throw new NotFoundError("User not found.");

    const [updatedUser] = await this.repo.patch(id, data);

    if (!updatedUser) throw new Error("Failed to update user.");

    await this.auditLogger.create({
      orgId: updatedUser.orgId,
      userId,
      title: `User #${updatedUser.no} Updated`,
      entity: "userManagement",
      action: "update",
      changes: {
        before: currentUser,
        after: updatedUser,
      },
    });

    return updatedUser;
  }

  async delete(id: string, userId: string) {
    const [user] = await this.repo.delete(id);

    if (!user) throw new NotFoundError("User not found.");

    await this.auditLogger.create({
      orgId: user.orgId,
      userId,
      title: `User #${user.no} Deleted`,
      entity: "userManagement",
      action: "delete",
      changes: {
        before: user,
        after: {},
      },
    });

    return user;
  }
}

export class UserInvitationService
  implements
    IBaseService<UserInvitation, InsertUserInvitation, UpdateUserInvitation>
{
  private repo = new UserInvitationRepository();
  private auditLogger = new AuditService();

  async create(data: InsertUserInvitation, userId: string) {
    const [invitation] = await this.repo.insert(data);

    if (!invitation) throw new Error("Failed to create user invitation.");

    await this.auditLogger.create({
      orgId: invitation.orgId,
      userId: userId!,
      title: `User Invitation #${invitation.no} Created`,
      entity: "invitationsManagement",
      action: "create",
      changes: {
        before: {},
        after: invitation,
      },
    });

    return invitation;
  }

  async findAll(orgId: string) {
    return await this.repo.readAll(orgId);
  }

  async findById(id: string) {
    const invitation = await this.repo.readById(id);

    if (!invitation) throw new NotFoundError("User invitation not found.");

    return invitation;
  }

  async update(id: string, data: UpdateUserInvitation) {
    const currentInvitation = await this.repo.readById(id);

    if (!currentInvitation)
      throw new NotFoundError("User invitation not found.");

    const [updatedInvitation] = await this.repo.patch(id, data);

    if (!updatedInvitation)
      throw new NotFoundError("User invitation not found.");

    return updatedInvitation;
  }

  async delete(id: string, userId: string) {
    const [invitation] = await this.repo.delete(id);

    if (!invitation) throw new NotFoundError("User invitation not found.");

    await this.auditLogger.create({
      orgId: invitation.orgId,
      userId,
      title: `User Invitation #${invitation.no} Deleted`,
      entity: "invitationsManagement",
      action: "delete",
      changes: {
        before: invitation,
        after: {},
      },
    });

    return invitation;
  }
}

export class UserRequestService
  implements IBaseService<UserRequest, InsertUserRequest, UpdateUserRequest>
{
  private repo = new UserRequestRepository();
  private auditLogger = new AuditService();

  async create(data: InsertUserRequest) {
    const [request] = await this.repo.insert(data);

    if (!request) throw new Error("Failed to create user request.");

    await this.auditLogger.create({
      orgId: request.orgId,
      userId: request.userId,
      title: `Request #${request.no} Created`,
      entity: "accessRequestsManagement",
      action: "create",
      changes: {
        before: {},
        after: request,
      },
    });

    return request;
  }

  async findAll(orgId: string) {
    return await this.repo.readAll(orgId);
  }

  async findById(id: string) {
    const request = await this.repo.readById(id);

    if (!request) throw new NotFoundError("User request not found.");

    return request;
  }

  async update(id: string, data: UpdateUserRequest, userId: string) {
    const currentRequest = await this.repo.readById(id);

    if (!currentRequest) throw new NotFoundError("User request not found.");

    const [updatedRequest] = await this.repo.patch(id, data);

    if (!updatedRequest) throw new NotFoundError("User request not found.");

    await this.auditLogger.create({
      orgId: updatedRequest.orgId,
      userId: userId,
      title: `Request #${updatedRequest.no} Updated`,
      entity: "accessRequestsManagement",
      action: "update",
      changes: {
        before: currentRequest,
        after: updatedRequest,
      },
    });

    return updatedRequest;
  }

  async delete(id: string, userId: string) {
    const [request] = await this.repo.delete(id);

    if (!request) throw new NotFoundError("User request not found.");

    await this.auditLogger.create({
      orgId: request.orgId,
      userId: userId,
      title: `Request #${request.no} Deleted`,
      entity: "accessRequestsManagement",
      action: "delete",
      changes: {
        before: request,
        after: {},
      },
    });

    return request;
  }
}

export class UserSettingsService
  implements IBaseService<UserSettings, InsertUserSettings, UpdateUserSettings>
{
  private repo = new UserSettingsRepository();

  async create(data: InsertUserSettings) {
    const [settings] = await this.repo.insert(data);

    if (!settings) throw new Error("Failed to create user settings.");

    return settings;
  }

  async findAll() {
    return await this.repo.readAll();
  }

  async findById(id: string) {
    const settings = await this.repo.readById(id);

    if (!settings) throw new NotFoundError("User settings not found.");

    return settings;
  }

  async findByUserId(userId: string) {
    const settings = await this.repo.readByUserId(userId);

    if (!settings) throw new NotFoundError("User settings not found.");

    return settings;
  }

  async update(id: string, data: UpdateUserSettings) {
    const [settings] = await this.repo.patch(id, data);

    if (!settings) throw new NotFoundError("User settings not found.");

    return settings;
  }

  async delete(id: string) {
    const [settings] = await this.repo.delete(id);

    if (!settings) throw new NotFoundError("User settings not found.");

    return settings;
  }
}

export class UserStatusService
  implements IBaseService<UserStatus, InsertUserStatus, UpdateUserStatus>
{
  private repo = new UserStatusRepository();

  async create(data: InsertUserStatus) {
    const [status] = await this.repo.insert(data);

    if (!status) throw new Error("Failed to create user status.");

    return status;
  }

  async findAll() {
    return await this.repo.readAll();
  }

  async findById(id: string) {
    const status = await this.repo.readById(id);

    if (!status) throw new NotFoundError("User status not found.");

    return status;
  }

  async findByUserId(userId: string) {
    const status = await this.repo.readByUserId(userId);

    if (!status) throw new NotFoundError("User status not found.");

    return status;
  }

  async update(id: string, data: UpdateUserStatus) {
    const [status] = await this.repo.patch(id, data);

    if (!status) throw new NotFoundError("User status not found.");

    return status;
  }

  async delete(id: string) {
    const [status] = await this.repo.delete(id);

    if (!status) throw new NotFoundError("User status not found.");

    return status;
  }
}

export class UserCollectonAssignmentService
  implements
    IBaseService<
      UserCollectionAssignment,
      InsertUserCollectionAssignment,
      UpdateUserCollectionAssignment
    >
{
  private db = db;
  private messaging = new MessagingService();
  private trashbin = new TrashbinService();
  private repo = new UserCollectionAssignmentRepository();

  async findAll() {
    return await this.repo.readAll();
  }

  async findById(id: string) {
    const assignment = await this.repo.readById(id);

    if (!assignment)
      throw new NotFoundError("User collection assignment not found.");

    return assignment;
  }

  async findByUserId(userId: string) {
    const assignment = await this.repo.readByUserId(userId);

    if (!assignment)
      throw new NotFoundError("User collection assignment not found.");

    return assignment;
  }

  async create(data: InsertUserCollectionAssignment) {
    const [assignment] = await this.repo.insert(data);

    if (!assignment)
      throw new Error("Failed to create user collection assignment.");

    const userAccount = await this.db.query.accountsTable.findFirst({
      where: (table, { eq }) => eq(table.userId, data.userId),
    });

    if (!userAccount) throw new Error("Account not found");

    const trashbin = await this.trashbin.findById(data.trashbinId);

    await this.messaging.sendNotification(
      userAccount.deviceToken!,
      {
        title: "♻️ New Collection Assignment!",
        body: "A new trash bin has been assigned to you for collection. Please review it in your dashboard.",
      },
      {
        url: `https://client.binspire.space/map?trashbin_id=${trashbin.id}&lat=${trashbin.latitude}&lng=${trashbin.longitude}`,
      },
    );

    return assignment;
  }

  async delete(id: string) {
    const [assignment] = await this.repo.delete(id);

    if (!assignment)
      throw new NotFoundError("User collection assignment not found.");

    return assignment;
  }
}

export class UserQuotaService
  implements IBaseService<UserQuota, InsertUserQuota, UpdateUserQuota>
{
  private repo = new UserQuotaRepository();

  async create(data: InsertUserQuota) {
    const [quota] = await this.repo.insert(data);

    if (!quota) throw new Error("Failed to create user quota.");

    return quota;
  }

  async findAll() {
    return await this.repo.readAll();
  }

  async findById(id: string) {
    const quota = await this.repo.readById(id);

    if (!quota) throw new NotFoundError("User quota not found.");

    return quota;
  }

  async findByUserId(userId: string) {
    const quota = await this.repo.readByUserId(userId);

    if (!quota) throw new NotFoundError("User quota not found.");

    return quota;
  }

  async update(id: string, data: UpdateUserQuota) {
    const [quota] = await this.repo.patch(id, data);

    if (!quota) throw new NotFoundError("User quota not found.");

    return quota;
  }

  async delete(id: string) {
    const [quota] = await this.repo.delete(id);

    if (!quota) throw new NotFoundError("User quota not found.");

    return quota;
  }
}

export class UserGreenHeartService
  implements
    IBaseService<UserGreenHeart, InsertUserGreenHeart, UpdateUserGreenHeart>
{
  private repo = new UserGreenHeartRepository();

  async create(data: InsertUserGreenHeart) {
    const [greenHeart] = await this.repo.insert(data);

    if (!greenHeart) throw new Error("Failed to create user green heart.");

    return greenHeart;
  }

  async findAll() {
    return await this.repo.readAll();
  }

  async findById(id: string) {
    const greenHeart = await this.repo.readById(id);

    if (!greenHeart) throw new NotFoundError("User green heart not found.");

    return greenHeart;
  }

  async findByUserId(userId: string) {
    const greenHeart = await this.repo.readByUserId(userId);

    if (!greenHeart) throw new NotFoundError("User green heart not found.");

    return greenHeart;
  }

  async update(id: string, data: UpdateUserGreenHeart) {
    const [greenHeart] = await this.repo.patch(id, data);

    if (!greenHeart) throw new NotFoundError("User green heart not found.");

    return greenHeart;
  }

  async delete(id: string) {
    const [greenHeart] = await this.repo.delete(id);

    if (!greenHeart) throw new NotFoundError("User green heart not found.");

    return greenHeart;
  }
}
