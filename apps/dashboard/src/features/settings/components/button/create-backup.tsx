import { useCreateBackup, useRestoreData } from "@binspire/query";
import { Button } from "@binspire/ui/components/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@binspire/ui/components/dialog";
import { Input } from "@binspire/ui/components/input";
import { FormFieldError } from "@binspire/ui/forms";
import { useForm } from "@tanstack/react-form";
import { CircleCheckIcon, Loader2 } from "lucide-react";
import { useState } from "react";
import z from "zod";
import { ShowToast } from "@/components/core/toast-notification";
import { useVerifyPassword } from "@/hooks/use-auth";
import { fileToBase64 } from "@/lib/utils";
import { usePermissionStore } from "@/store/permission-store";

const backupFormSchema = z.object({
  password: z.string().min(8, "Password must be at least 8 characters long"),
});

export function CreateBackup() {
  const { permission } = usePermissionStore();
  const createBackup = useCreateBackup();
  const verifyPassword = useVerifyPassword();
  const [open, setOpen] = useState(false);

  const hasPermission = permission.settingsManagement?.actions.update;

  const form = useForm({
    defaultValues: {
      password: "",
    },
    validators: {
      onSubmit: backupFormSchema,
    },
    onSubmit: async ({ value, formApi }) => {
      try {
        const data = {
          data: {
            newPassword: value.password,
            currentPassword: value.password,
          },
        };

        await verifyPassword.mutateAsync(data);
        const result = await createBackup.mutateAsync();

        if (result?.url) {
          const a = document.createElement("a");
          a.href = result.url;
          a.download = "";
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
        }

        ShowToast("success", "Backup created successfully");

        formApi.reset();

        setOpen(false);

        verifyPassword.reset();
      } catch (error) {
        const err = error as Error;
        ShowToast(
          "error",
          err.message || "Failed to create backup. Please try again.",
        );
      }
    },
  });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          size="lg"
          variant="secondary"
          type="button"
          disabled={!hasPermission}
        >
          Create Backup
        </Button>
      </DialogTrigger>

      <DialogContent>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            e.stopPropagation();
            form.handleSubmit();
          }}
        >
          <DialogHeader>
            <DialogTitle>Create Backup</DialogTitle>
            <DialogDescription>
              This will create a backup of your database. This action cannot be
              undone.
            </DialogDescription>
          </DialogHeader>

          <div className="mt-4 flex flex-col gap-2">
            <p className="text-sm">
              Please enter your password for confirmation
            </p>
            <form.Field name="password">
              {(field) => (
                <>
                  <div className="relative">
                    <Input
                      type="password"
                      placeholder="Enter your password"
                      className="w-full"
                      value={field.state.value}
                      onChange={(e) => field.handleChange(e.target.value)}
                      field={field}
                      disabled={
                        verifyPassword.isPending || verifyPassword.isSuccess
                      }
                    />

                    {verifyPassword.isPending && (
                      <Loader2
                        className="animate-spin absolute top-4 right-4"
                        size={16}
                      />
                    )}

                    {verifyPassword.isSuccess && (
                      <CircleCheckIcon
                        className="text-emerald-500 absolute top-4 right-4"
                        size={16}
                      />
                    )}
                  </div>

                  <FormFieldError field={field} />
                </>
              )}
            </form.Field>
          </div>

          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline" size="sm">
                Cancel
              </Button>
            </DialogClose>

            <form.Subscribe
              selector={(state) => [state.canSubmit]}
              children={([canSubmit]) => (
                <Button
                  disabled={createBackup.isPending || !canSubmit}
                  size="sm"
                >
                  {createBackup.isPending ? (
                    <Loader2 className="animate-spin" />
                  ) : (
                    "Confirm"
                  )}
                </Button>
              )}
            />
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

const restoreBackupFormSchema = z.object({
  password: z.string().min(8, "Password must be at least 8 characters long"),
  file: z.instanceof(File, { message: "Please select a backup file." }),
});

export function RestoreBackup() {
  const [open, setOpen] = useState(false);
  const restoreData = useRestoreData();
  const verifyPassword = useVerifyPassword();

  const form = useForm({
    defaultValues: {
      password: "",
      file: undefined as File | undefined,
    },
    validators: {
      onSubmit: restoreBackupFormSchema,
    },
    onSubmit: async ({ value, formApi }) => {
      const { password, file } = value;

      try {
        const passwordData = {
          data: {
            newPassword: password,
            currentPassword: password,
          },
        };

        await verifyPassword.mutateAsync(passwordData);

        const base64FileString = await fileToBase64(file as File);

        await restoreData.mutateAsync(base64FileString);

        ShowToast("success", "Backup restored successfully");

        formApi.reset();
        setOpen(false);
        verifyPassword.reset();
      } catch (error) {
        const err = error as Error;
        ShowToast("info", err.message || "Trying to restoring data...");
      }
    },
  });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="lg" variant="secondary" type="button" disabled>
          Restore Backup
        </Button>
      </DialogTrigger>

      <DialogContent>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            e.stopPropagation();
            form.handleSubmit();
          }}
        >
          <DialogHeader>
            <DialogTitle>Restore Backup</DialogTitle>
            <DialogDescription>
              This will restore your database from the selected backup. All
              current data may be overwritten. This action cannot be undone.
            </DialogDescription>
          </DialogHeader>

          <div className="mt-4 flex flex-col gap-2">
            <p className="text-sm">
              Please enter your password for confirmation
            </p>
            <form.Field name="password">
              {(field) => (
                <>
                  <div className="relative">
                    <Input
                      type="password"
                      placeholder="Enter your password"
                      className="w-full"
                      value={field.state.value}
                      onChange={(e) => field.handleChange(e.target.value)}
                      disabled={
                        verifyPassword.isPending || verifyPassword.isSuccess
                      }
                    />
                    {verifyPassword.isPending && (
                      <Loader2
                        className="animate-spin absolute top-4 right-4"
                        size={16}
                      />
                    )}
                    {verifyPassword.isSuccess && (
                      <CircleCheckIcon
                        className="text-emerald-500 absolute top-4 right-4"
                        size={16}
                      />
                    )}
                  </div>
                  <FormFieldError field={field} />
                </>
              )}
            </form.Field>
          </div>

          <div className="mt-4 flex flex-col gap-2">
            <p className="text-sm">Choose the backup file</p>
            <form.Field name="file">
              {(field) => (
                <>
                  <Input
                    type="file"
                    onChange={(e) =>
                      field.handleChange(
                        e.target.files ? e.target.files[0] : undefined,
                      )
                    }
                    disabled
                  />
                  <FormFieldError field={field} />
                </>
              )}
            </form.Field>
          </div>

          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline" size="sm">
                Cancel
              </Button>
            </DialogClose>

            <form.Subscribe
              selector={(state) => [state.canSubmit]}
              children={([canSubmit]) => (
                <Button
                  disabled={
                    restoreData.isPending ||
                    !canSubmit ||
                    verifyPassword.isPending
                  }
                  size="sm"
                >
                  {restoreData.isPending ? (
                    <Loader2 className="animate-spin" />
                  ) : (
                    "Confirm"
                  )}
                </Button>
              )}
            />
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
