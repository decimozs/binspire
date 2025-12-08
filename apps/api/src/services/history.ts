import type {
  History,
  InsertHistory,
  UpdateHistory,
} from "@binspire/db/schema";
import { NotFoundError } from "@/features/error";
import type { IBaseService } from "@/lib/types";
import { HistoryRepository } from "@/repository";

export class HistoryService
  implements IBaseService<History, InsertHistory, UpdateHistory>
{
  private repo = new HistoryRepository();

  async create(data: InsertHistory) {
    const [history] = await this.repo.insert(data);

    if (!history) throw new Error("Failed to create history.");

    return history;
  }

  async findAll(orgId: string) {
    return await this.repo.readAll(orgId);
  }

  async findById(id: string) {
    const history = await this.repo.readById(id);

    if (!history) throw new NotFoundError("History not found.");

    return history;
  }

  async update(id: string, data: UpdateHistory) {
    const [history] = await this.repo.patch(id, data);

    if (!history) throw new NotFoundError("History not found.");

    return history;
  }

  async delete(id: string) {
    const [history] = await this.repo.delete(id);

    if (!history) throw new NotFoundError("History not found.");

    return history;
  }
}
