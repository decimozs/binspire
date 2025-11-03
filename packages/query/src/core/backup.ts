import { rpc } from "../lib/api-client";

export class BackupApi {
  static async create() {
    const response = await rpc.api.backups.create.$get();

    if (!response.ok) throw new Error("Failed to create backup");

    return await response.json();
  }

  static async restore(dumpFile: string) {
    const response = await rpc.api.backups.restore.$post({
      json: { dumpFile },
    });

    if (!response.ok) throw new Error("Failed to restore backup");

    return await response.json();
  }
}
