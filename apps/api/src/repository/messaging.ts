import { db, eq } from "@binspire/db";
import { accountsTable } from "@binspire/db/schema";

export class MessagingRepository {
  private db = db;

  async registerFCM(userId: string, fcmToken: string) {
    const isRegistered = await this.db.query.accountsTable.findFirst({
      where: (table, { eq }) =>
        eq(table.userId, userId) && eq(table.deviceToken, fcmToken),
    });

    if (isRegistered) {
      return isRegistered;
    }

    return await this.db
      .update(accountsTable)
      .set({
        deviceToken: fcmToken,
      })
      .where(eq(accountsTable.userId, userId))
      .returning();
  }
}
