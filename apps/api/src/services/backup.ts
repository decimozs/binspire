import { exec } from "child_process";
import { AuditService } from "./audit";

interface IBackupService {
  create(userId: string, orgId: string): Promise<string>;
  restore(dumpFile: string, userId: string, orgId: string): Promise<unknown>;
}

export class BackupService implements IBackupService {
  private auditLogger = new AuditService();

  async create(userId: string, orgId: string) {
    const dumpFile = `binspire-backup-${Date.now()}.bak`;

    const backup = new Promise<string>((resolve, reject) => {
      exec(
        `pg_dump -Fc -v -d "${Bun.env.DATABASE_URL}" -f ${dumpFile}`,
        (err) => {
          if (err) reject(err);
          else resolve(dumpFile);
        },
      );
    });

    if (!backup) {
      throw new Error("Backup failed");
    }

    await this.auditLogger.create({
      orgId,
      userId,
      title: `Database Backup Created`,
      entity: "settingsManagement",
      action: "create",
      changes: {
        before: {},
        after: { dumpFile },
      },
    });

    return backup;
  }

  async restore(dumpFile: string, userId: string, orgId: string) {
    const data = new Promise((resolve, reject) => {
      exec(
        `pg_restore -v -d "${Bun.env.DATABASE_URL}" ${dumpFile}`,
        (error, stdout, stderr) => {
          if (error) return reject(error);
          if (stderr) console.error(`Stderr: ${stderr}`);
          resolve(`Database restored from ${dumpFile}`);
        },
      );
    });

    if (!data) {
      throw new Error("Restore failed");
    }

    await this.auditLogger.create({
      orgId,
      userId,
      title: `Database Restored`,
      entity: "settingsManagement",
      action: "restore",
      changes: {
        before: {},
        after: { dumpFile },
      },
    });

    return data;
  }
}
