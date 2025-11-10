import { exec } from "child_process";
import { AuditService } from "./audit";
import fs from "fs";
import { supabase } from "@/features/supabase";
import path from "path";

interface IBackupService {
  create(userId: string, orgId: string): Promise<{ url: string }>;
  restore(dumpFile: string, userId: string, orgId: string): Promise<unknown>;
}

export class BackupService implements IBackupService {
  private auditLogger = new AuditService();

  async create(userId: string, orgId: string) {
    const dumpFile = `binspire-backup-${Date.now()}.bak`;

    await new Promise<void>((resolve, reject) => {
      exec(
        `pg_dump -Fc -v -d "${Bun.env.TEST_DATABASE_URL}" -f ${dumpFile}`,
        (err) => {
          if (err) reject(err);
          else resolve();
        },
      );
    });

    const fileData = fs.readFileSync(dumpFile);
    const { error } = await supabase.storage
      .from("binspire_bucket/backups")
      .upload(dumpFile, fileData, {
        contentType: "application/octet-stream",
        upsert: true,
      });

    if (error) throw error;

    const { data: urlData } = supabase.storage
      .from("binspire_bucket/backups")
      .getPublicUrl(dumpFile);

    fs.unlinkSync(dumpFile);

    await this.auditLogger.create({
      orgId,
      userId,
      title: "Database Backup Created",
      entity: "settingsManagement",
      action: "create",
      changes: { before: {}, after: { dumpFile, url: urlData.publicUrl } },
    });

    return { url: urlData.publicUrl };
  }

  async restore(base64DataUrl: string, userId: string, orgId: string) {
    const parts = base64DataUrl.split(",");
    if (parts.length !== 2) {
      throw new Error("Invalid base64 data URL format.");
    }

    const base64Data = parts[1];

    const fileBuffer = Buffer.from(base64Data!, "base64");

    const dumpFileName = `restore_${userId}_${Date.now()}.dump`;
    const localFilePath = path.resolve(`/tmp/${dumpFileName}`);

    await fs.promises.writeFile(localFilePath, fileBuffer);

    await new Promise<void>((resolve, reject) => {
      exec(
        `pg_restore -v -d "${process.env.TEST_DATABASE_URL}" "${localFilePath}"`,
        (err, stdout, stderr) => {
          if (err) {
            return reject(err);
          }
          resolve();
        },
      );
    });

    await fs.promises.unlink(localFilePath);

    return dumpFileName;
  }
}
