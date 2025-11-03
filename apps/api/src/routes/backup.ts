import { BackupHandler } from "@/handlers";
import { factory } from "@/lib/factory";

const handler = new BackupHandler();

export const backupRoutes = factory
  .createApp()
  .get("/create", ...handler.createBackup)
  .post("/restore", ...handler.restoreData);
