import type { IBaseRepository } from "@/lib/types";
import { db, eq } from "@binspire/db";
import {
  userGreenHeartsTable,
  userCollectionAssignmentsTable,
  userInvitationsTable,
  userSettingsTable,
  usersRequestsTable,
  usersTable,
  userStatusTable,
  userQuotaTable,
  type InsertUserGreenHeart,
  type InsertUserQuota,
  type InsertUser,
  type InsertUserCollectionAssignment,
  type InsertUserInvitation,
  type InsertUserRequest,
  type InsertUserSettings,
  type InsertUserStatus,
  type UpdateUserGreenHeart,
  type UpdateUser,
  type UpdateUserQuota,
  type UpdateUserInvitation,
  type UpdateUserRequest,
  type UpdateUserSettings,
  type UpdateUserStatus,
  type User,
  type UserGreenHeart,
  type UserInvitation,
  type UserRequest,
  type UserSettings,
  type UserStatus,
  type UserQuota,
} from "@binspire/db/schema";

export class UserRepository
  implements IBaseRepository<User, InsertUser, UpdateUser>
{
  private db = db;

  async insert(data: InsertUser) {
    return await this.db.insert(usersTable).values(data).returning();
  }

  async readAll(orgId: string) {
    return await this.db.query.usersTable.findMany({
      where: (table, { eq }) => eq(table.orgId, orgId),
      orderBy: (table, { desc }) => [desc(table.createdAt)],
      with: {
        settings: true,
        status: true,
        audits: true,
        history: true,
        issues: true,
        collections: true,
        assignCollections: true,
        greenhearts: true,
      },
    });
  }

  async readById(id: string) {
    const user = await this.db.query.usersTable.findFirst({
      where: (table, { eq }) => eq(table.id, id),
      with: {
        settings: true,
        status: true,
        audits: true,
        history: true,
        issues: true,
        collections: true,
        assignCollections: true,
        greenhearts: true,
      },
    });

    return user ?? null;
  }

  async readByEmail(email: string) {
    const user = await this.db.query.usersTable.findFirst({
      where: (table, { eq }) => eq(table.email, email),
      with: {
        settings: true,
        status: true,
        audits: true,
        history: true,
        issues: true,
        collections: true,
        assignCollections: true,
        greenhearts: true,
      },
    });

    return user ?? null;
  }

  async patch(id: string, data: UpdateUser) {
    return await this.db
      .update(usersTable)
      .set(data)
      .where(eq(usersTable.id, id))
      .returning();
  }

  async delete(id: string) {
    return await this.db
      .delete(usersTable)
      .where(eq(usersTable.id, id))
      .returning();
  }
}

export class UserInvitationRepository
  implements
    IBaseRepository<UserInvitation, InsertUserInvitation, UpdateUserInvitation>
{
  private db = db;

  async insert(data: InsertUserInvitation) {
    return await this.db.insert(userInvitationsTable).values(data).returning();
  }

  async readAll(orgId: string) {
    return await this.db.query.userInvitationsTable.findMany({
      where: (table, { eq }) => eq(table.orgId, orgId),
      orderBy: (table, { desc }) => [desc(table.updatedAt)],
      with: {
        user: true,
      },
    });
  }

  async readById(id: string) {
    const invitation = await this.db.query.userInvitationsTable.findFirst({
      where: (table, { eq }) => eq(table.id, id),
      with: {
        user: true,
      },
    });

    return invitation ?? null;
  }

  async patch(id: string, data: UpdateUserInvitation) {
    return await this.db
      .update(userInvitationsTable)
      .set(data)
      .where(eq(userInvitationsTable.id, id))
      .returning();
  }

  async delete(id: string) {
    return await this.db
      .delete(userInvitationsTable)
      .where(eq(userInvitationsTable.id, id))
      .returning();
  }
}

export class UserRequestRepository
  implements IBaseRepository<UserRequest, InsertUserRequest, UpdateUserRequest>
{
  private db = db;

  async insert(data: InsertUserRequest) {
    return await this.db.insert(usersRequestsTable).values(data).returning();
  }

  async readAll(orgId: string) {
    return await this.db.query.usersRequestsTable.findMany({
      where: (table, { eq }) => eq(table.orgId, orgId),
      orderBy: (table, { desc }) => [desc(table.updatedAt)],
      with: {
        user: true,
      },
    });
  }

  async readById(id: string) {
    const request = await this.db.query.usersRequestsTable.findFirst({
      where: (table, { eq }) => eq(table.id, id),
      with: {
        user: true,
      },
    });

    return request ?? null;
  }

  async patch(id: string, data: UpdateUserRequest) {
    return await this.db
      .update(usersRequestsTable)
      .set(data)
      .where(eq(usersRequestsTable.id, id))
      .returning();
  }

  async delete(id: string) {
    return await this.db
      .delete(usersRequestsTable)
      .where(eq(usersRequestsTable.id, id))
      .returning();
  }
}

export class UserSettingsRepository
  implements
    IBaseRepository<UserSettings, InsertUserSettings, UpdateUserSettings>
{
  private db = db;

  async insert(data: InsertUserSettings) {
    return await this.db.insert(userSettingsTable).values(data).returning();
  }

  async readAll() {
    return await this.db.query.userSettingsTable.findMany();
  }

  async readById(id: string) {
    const settings = await this.db.query.userSettingsTable.findFirst({
      where: (table, { eq }) => eq(table.id, id),
    });

    return settings ?? null;
  }

  async readByUserId(userId: string) {
    const settings = await this.db.query.userSettingsTable.findFirst({
      where: (table, { eq }) => eq(table.userId, userId),
    });

    return settings ?? null;
  }

  async patch(userId: string, data: UpdateUserSettings) {
    return await this.db
      .update(userSettingsTable)
      .set(data)
      .where(eq(userSettingsTable.userId, userId))
      .returning();
  }

  async delete(userId: string) {
    return await this.db
      .delete(userSettingsTable)
      .where(eq(userSettingsTable.id, userId))
      .returning();
  }
}

export class UserStatusRepository
  implements IBaseRepository<UserStatus, InsertUserStatus, UpdateUserStatus>
{
  private db = db;

  async insert(data: InsertUserStatus) {
    return await this.db.insert(userStatusTable).values(data).returning();
  }

  async readAll() {
    return await this.db.query.userStatusTable.findMany();
  }

  async readById(id: string) {
    const status = await this.db.query.userStatusTable.findFirst({
      where: (table, { eq }) => eq(table.id, id),
    });

    return status ?? null;
  }

  async readByUserId(userId: string) {
    const status = await this.db.query.userStatusTable.findFirst({
      where: (table, { eq }) => eq(table.userId, userId),
    });

    return status ?? null;
  }

  async patch(userId: string, data: UpdateUserStatus) {
    return await this.db
      .update(userStatusTable)
      .set(data)
      .where(eq(userStatusTable.userId, userId))
      .returning();
  }

  async delete(userId: string) {
    return await this.db
      .delete(userStatusTable)
      .where(eq(userStatusTable.userId, userId))
      .returning();
  }
}

export class UserCollectionAssignmentRepository {
  private db = db;

  async readAll() {
    return await this.db.query.userCollectionAssignmentsTable.findMany({
      with: {
        user: true,
        trashbin: true,
      },
    });
  }

  async readById(id: string) {
    const assignment =
      await this.db.query.userCollectionAssignmentsTable.findFirst({
        where: (table, { eq }) => eq(table.id, id),
        with: {
          user: true,
          trashbin: true,
        },
      });

    return assignment ?? null;
  }

  async readByUserId(userId: string) {
    const assignment =
      await this.db.query.userCollectionAssignmentsTable.findMany({
        where: (table, { eq }) => eq(table.userId, userId),
        with: {
          user: true,
          trashbin: true,
        },
      });

    return assignment ?? null;
  }

  async insert(data: InsertUserCollectionAssignment) {
    return await this.db
      .insert(userCollectionAssignmentsTable)
      .values(data)
      .returning();
  }

  async delete(id: string) {
    return await this.db
      .delete(userCollectionAssignmentsTable)
      .where(eq(userCollectionAssignmentsTable.id, id))
      .returning();
  }
}

export class UserQuotaRepository
  implements IBaseRepository<UserQuota, InsertUserQuota, UpdateUserQuota>
{
  private db = db;

  async insert(data: InsertUserQuota) {
    return await this.db.insert(userQuotaTable).values(data).returning();
  }

  async readAll() {
    return await this.db.query.userQuotaTable.findMany();
  }

  async readById(id: string) {
    const quota = await this.db.query.userQuotaTable.findFirst({
      where: (table, { eq }) => eq(table.id, id),
    });

    return quota ?? null;
  }

  async readByUserId(userId: string) {
    const quota = await this.db.query.userQuotaTable.findFirst({
      where: (table, { eq }) => eq(table.userId, userId),
    });

    return quota ?? null;
  }

  async patch(userId: string, data: UpdateUserQuota) {
    return await this.db
      .update(userQuotaTable)
      .set(data)
      .where(eq(userQuotaTable.userId, userId))
      .returning();
  }

  async delete(userId: string) {
    return await this.db
      .delete(userQuotaTable)
      .where(eq(userQuotaTable.userId, userId))
      .returning();
  }
}

export class UserGreenHeartRepository
  implements
    IBaseRepository<UserGreenHeart, InsertUserGreenHeart, UpdateUserGreenHeart>
{
  private db = db;

  async insert(data: InsertUserGreenHeart) {
    return await this.db.insert(userGreenHeartsTable).values(data).returning();
  }

  async readAll() {
    return await this.db.query.userGreenHeartsTable.findMany({
      with: {
        user: true,
      },
    });
  }

  async readById(id: string) {
    const greenHeart = await this.db.query.userGreenHeartsTable.findFirst({
      where: (table, { eq }) => eq(table.id, id),
      with: {
        user: true,
      },
    });

    return greenHeart ?? null;
  }

  async readByUserId(userId: string) {
    const greenHeart = await this.db.query.userGreenHeartsTable.findFirst({
      where: (table, { eq }) => eq(table.userId, userId),
      with: {
        user: true,
      },
    });

    if (!greenHeart) {
      const [newGreenHeart] = await this.insert({ userId });

      const getNewGreenHeart =
        await this.db.query.userGreenHeartsTable.findFirst({
          where: (table, { eq }) =>
            eq(table.userId, newGreenHeart?.userId as string),
          with: {
            user: true,
          },
        });

      return getNewGreenHeart;
    }

    return greenHeart ?? null;
  }

  async patch(userId: string, data: UpdateUserGreenHeart) {
    return await this.db
      .update(userGreenHeartsTable)
      .set(data)
      .where(eq(userGreenHeartsTable.userId, userId))
      .returning();
  }

  async delete(id: string) {
    return await this.db
      .delete(userGreenHeartsTable)
      .where(eq(userGreenHeartsTable.id, id))
      .returning();
  }
}
