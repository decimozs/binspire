import type { InsertIssue, Issue, UpdateIssue } from "@binspire/db/schema";
import { NotFoundError } from "@/features/error";
import type { IBaseService } from "@/lib/types";
import { IssueRepository } from "@/repository";
import { AuditService } from "./audit";

export class IssueService
  implements IBaseService<Issue, InsertIssue, UpdateIssue>
{
  private repo = new IssueRepository();
  private auditLogger = new AuditService();

  async create(data: InsertIssue) {
    const [issue] = await this.repo.insert(data);

    if (!issue) throw new Error("Failed to create issue.");

    await this.auditLogger.create({
      orgId: issue.orgId,
      userId: issue.userId,
      title: `Issue #${issue.no} Created`,
      entity: "issueManagement",
      action: "create",
      changes: {
        before: {},
        after: issue,
      },
    });

    return issue;
  }

  async findAll(orgId: string) {
    return await this.repo.readAll(orgId);
  }

  async findById(id: string) {
    const issue = await this.repo.readById(id);

    if (!issue) throw new NotFoundError("issue not found.");

    return issue;
  }

  async update(id: string, data: UpdateIssue, userId: string) {
    const issue = await this.repo.readById(id);

    if (!issue) throw new NotFoundError("issue not found.");

    const [updatedIssue] = await this.repo.patch(id, data);

    if (!updatedIssue) throw new NotFoundError("issue not found.");

    await this.auditLogger.create({
      orgId: updatedIssue.orgId,
      userId: userId,
      title: `Issue #${updatedIssue.no} Updated`,
      entity: "issueManagement",
      action: "update",
      changes: {
        before: issue,
        after: updatedIssue,
      },
    });

    return updatedIssue;
  }

  async delete(id: string, userId: string) {
    const [issue] = await this.repo.delete(id);

    if (!issue) throw new NotFoundError("issue not found.");

    await this.auditLogger.create({
      orgId: issue.orgId,
      userId: userId,
      title: `Issue #${issue.no} Deleted`,
      entity: "issueManagement",
      action: "delete",
      changes: {
        before: issue,
        after: {},
      },
    });

    return issue;
  }
}
