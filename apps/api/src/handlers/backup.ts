import { factory } from "@/lib/factory";
import { BackupService } from "@/services";

export class BackupHandler {
  private service = new BackupService();

  createBackup = factory.createHandlers(async (c) => {
    const userId = c.get("user")?.id!;
    const orgId = c.get("user")?.orgId!;
    const data = await this.service.create(userId, orgId);

    return c.json(data, 200);
  });

  restoreData = factory.createHandlers(async (c) => {
    const { dumpFile } = await c.req.json();
    const userId = c.get("user")?.id!;
    const orgId = c.get("user")?.orgId!;

    if (!dumpFile) {
      return c.json({ message: "Dump file is required" }, 400);
    }

    await this.service.restore(dumpFile, userId, orgId);

    return c.json(200);
  });
}
