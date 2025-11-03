import { useMutation } from "@tanstack/react-query";
import { BackupApi } from "../../core";

export function useCreateBackup() {
  return useMutation({
    mutationFn: () => BackupApi.create(),
  });
}

export function useRestoreData() {
  return useMutation({
    mutationFn: (dumpFile: string) => BackupApi.restore(dumpFile),
  });
}
