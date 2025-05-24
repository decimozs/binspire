import { Button } from "@/components/ui/button";
import { ArchiveRestore, DatabaseBackup, Loader2 } from "lucide-react";
import { useState } from "react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { FileUploader } from "../shared/file-uploader";

const RestoreBackupButton = () => {
  const [isUploading, setIsUploading] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleRestore = () => {
    setIsUploading(true);

    setTimeout(() => {
      setIsUploading(false);
      setIsDialogOpen(false); // Auto-close dialog after upload completes
      toast.success("Restoration Successfully");
    }, 5000); // Simulate 5-second upload
  };

  return (
    <div className="flex flex-row gap-4 items-center">
      <div className="border-input border-[1px] border-dashed rounded-md p-4">
        <ArchiveRestore />
      </div>
      <div className="flex flex-col">
        <p>Restore</p>
        <p className="text-sm text-muted-foreground">
          Upload a previously downloaded `.sql` backup file to restore the
          system's data. This will overwrite existing records.
        </p>
      </div>
      <div className="ml-4 w-[79px]">
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>Restore</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Do you want to restore your data?</DialogTitle>
              <DialogDescription>
                Restoring a backup will overwrite the current system data with
                the selected backup file. This action cannot be undone. Please
                ensure the backup file is correct before proceeding.
              </DialogDescription>
            </DialogHeader>
            <FileUploader />
            <DialogFooter>
              <Button onClick={handleRestore} disabled={isUploading}>
                {isUploading ? (
                  <>
                    <Loader2 className="animate-spin mr-2 h-4 w-4" />
                    Restoring...
                  </>
                ) : (
                  "Confirm"
                )}
              </Button>
              <DialogClose asChild>
                <Button type="button" variant="secondary">
                  Close
                </Button>
              </DialogClose>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

const BackUpButton = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isReadyToDownload, setIsReadyToDownload] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleBackup = () => {
    setIsLoading(true);

    setTimeout(() => {
      setIsReadyToDownload(true);
    }, 3000);

    setTimeout(() => {
      setIsLoading(false);
      setIsReadyToDownload(false);

      const blob = new Blob(["-- SQL DUMP CONTENT HERE --"], {
        type: "application/sql",
      });
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = "backup.sql";
      setIsDialogOpen(false);
      link.click();
      URL.revokeObjectURL(link.href);
      toast.success("Backup Successfully");
    }, 5000);
  };

  return (
    <div className="flex flex-row gap-4 items-center">
      <div className="border-input border-[1px] border-dashed rounded-md p-4">
        <DatabaseBackup />
      </div>
      <div className="flex flex-col">
        <p>Backup</p>
        <p className="text-sm text-muted-foreground">
          Generate a backup of the current database and download it as a `.sql`
          file. Use this to safeguard data or migrate the system.
        </p>
      </div>
      <div className="ml-4">
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="w-[79px]">Backup</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Do you want to back up your data?</DialogTitle>
              <DialogDescription>
                This operation will generate a complete backup of the system
                data. Please ensure there is sufficient storage and do not
                interrupt the process once started.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button onClick={handleBackup} disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="animate-spin mr-2 h-4 w-4" />
                    Preparing...
                  </>
                ) : (
                  "Backup"
                )}
              </Button>
              <DialogClose asChild>
                <Button type="button" variant="secondary">
                  Close
                </Button>
              </DialogClose>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default function Backup() {
  return (
    <div className="flex flex-col gap-6 max-w-2xl">
      <h1 className="text-3xl font-semibold">Backup</h1>
      <BackUpButton />
      <RestoreBackupButton />
    </div>
  );
}
