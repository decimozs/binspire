import { db, eq } from "@binspire/db";
import {
  type InsertIssue,
  type Issue,
  issuesTable,
  type UpdateIssue,
} from "@binspire/db/schema";
import type { IBaseRepository } from "@/lib/types";

export class IssueRepository
  implements IBaseRepository<Issue, InsertIssue, UpdateIssue>
{
  private db = db;

  async insert(data: InsertIssue) {
    return await this.db.insert(issuesTable).values(data).returning();
  }

  async readAll(orgId: string) {
    return await this.db.query.issuesTable.findMany({
      with: {
        user: true,
      },
      where: (table, { eq }) => eq(table.orgId, orgId),
      orderBy: (table, { desc }) => [desc(table.updatedAt)],
    });
  }

  async readById(id: string) {
    const issue = await this.db.query.issuesTable.findFirst({
      where: (table, { eq }) => eq(table.id, id),
      with: {
        user: true,
      },
    });

    return issue ?? null;
  }

  async patch(id: string, data: UpdateIssue) {
    return await this.db
      .update(issuesTable)
      .set(data)
      .where(eq(issuesTable.id, id))
      .returning();
  }

  async delete(id: string) {
    return await this.db
      .delete(issuesTable)
      .where(eq(issuesTable.id, id))
      .returning();
  }
}
