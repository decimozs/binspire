import { useForm } from "@tanstack/react-form";
import z from "zod";
import { Button } from "@binspire/ui/components/button";
import { Skeleton } from "@binspire/ui/components/skeleton";
import { Switch } from "@binspire/ui/components/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@binspire/ui/components/select";
import { authClient } from "@/lib/auth-client";
import { useState } from "react";
import { ShowToast } from "@/components/core/toast-notification";
import SaveChangesButton from "./button/save-changes";
import SettingsLayout from "@/components/layout/settings-layout";
import { usePermissionStore } from "@/store/permission-store";
import WarningSign from "@/components/sign/warnings";
import { backupFrequencies } from "../lib/constants";
import { CreateBackup, RestoreBackup } from "./button/create-backup";
import type { BackupFrequency } from "../lib/types";
import {
  useGetOrganizationSettingsById,
  useUpdateOrganizationSettings,
} from "@binspire/query";
import { FormFieldError } from "@binspire/ui/forms";

const backupFormSchema = z.object({
  automaticBackup: z.boolean(),
  frequency: z.enum(backupFrequencies.map((f) => f.value)),
});

export default function BackupSettings() {
  const session = authClient.useSession();
  const currentUser = session.data?.user;
  const { permission } = usePermissionStore();
  const updateOrgSettings = useUpdateOrganizationSettings();
  const [confirmation, setConfirmationOpen] = useState(false);
  const hasPermission = permission.settingsManagement?.actions.update;

  const { data: settings, isPending } = useGetOrganizationSettingsById(
    currentUser?.orgId as string,
  );
  const currentSettings = settings?.settings;

  const form = useForm({
    defaultValues: {
      automaticBackup: currentSettings?.backup?.autoBackup ?? false,
      frequency: currentSettings?.backup?.backupFrequency ?? "weekly",
    },
    validators: {
      onSubmit: backupFormSchema,
      onChange: backupFormSchema,
      onBlur: backupFormSchema,
    },
    onSubmit: async ({ value }) => {
      await updateOrgSettings.mutateAsync({
        orgId: currentUser?.orgId as string,
        data: {
          ...currentSettings,
          backup: {
            autoBackup: value.automaticBackup,
            backupFrequency: value.frequency,
          },
        },
      });
      ShowToast("success", "Backup settings updated.");
      setConfirmationOpen(false);
    },
  });

  return (
    <SettingsLayout
      label="Backup"
      description="Manage your system backups with scheduling, frequency, manual restore, and cloud sync options."
    >
      {!hasPermission && <WarningSign />}
      <form
        id="backup-form"
        className="flex flex-col gap-6 md:w-md"
        onSubmit={(e) => {
          e.preventDefault();
          e.stopPropagation();
          form.handleSubmit();
        }}
      >
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <p>Automatic Backup</p>
            <form.Field name="automaticBackup">
              {(field) => (
                <>
                  {isPending ? (
                    <Skeleton className="h-[20px] w-16 rounded-full" />
                  ) : (
                    <div className="flex flex-row items-center gap-2">
                      <p className="text-sm">
                        {field.state.value ? "On" : "Off"}
                      </p>
                      <Switch
                        checked={field.state.value}
                        onCheckedChange={(checked) => field.setValue(checked)}
                        disabled={!hasPermission}
                      />
                    </div>
                  )}
                  <FormFieldError field={field} />
                </>
              )}
            </form.Field>
          </div>
          <p className="text-sm text-muted-foreground">
            Enable or disable scheduled backups of your system data.
          </p>
        </div>

        <div className="flex flex-col gap-2">
          <p>Backup Frequency</p>
          <form.Field name="frequency">
            {(field) => (
              <>
                <Select
                  value={field.state.value}
                  onValueChange={(val: BackupFrequency) => field.setValue(val)}
                >
                  {isPending ? (
                    <Skeleton className="h-9 w-full rounded-md" />
                  ) : (
                    <SelectTrigger className="w-full" disabled={!hasPermission}>
                      <SelectValue />
                    </SelectTrigger>
                  )}
                  <SelectContent>
                    {backupFrequencies.map((freq) => (
                      <SelectItem
                        key={freq.value}
                        value={freq.value}
                        onSelect={() => field.setValue(freq.value)}
                        disabled={!hasPermission}
                      >
                        {freq.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormFieldError field={field} />
              </>
            )}
          </form.Field>
          <p className="text-sm text-muted-foreground">
            Choose how often automatic backups should occur.
          </p>
        </div>

        <div className="flex flex-col gap-2">
          <p>Manual Backup</p>
          <CreateBackup />
          <p className="text-sm text-muted-foreground">
            Instantly create a backup of current system data.
          </p>
        </div>

        <div className="flex flex-col gap-2">
          <p>Restore Data</p>
          <WarningSign
            message="Expiremental may not work reliably."
            iconSize={20}
            iconClassName="mt-0.5"
          />
          <RestoreBackup />
          <p className="text-sm text-muted-foreground">
            Upload a previously downloaded backup file to restore your system.
          </p>
          <p className="text-sm">Another option for restoring data</p>
          <a
            href="https://docs.binspire.space/docs/guides/backup"
            className="w-full"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Button variant="outline" size="lg" className="w-full">
              Read Documentation
            </Button>
          </a>
          <p className="text-sm text-muted-foreground">
            Learn more about backup restoration in manual way.
          </p>
        </div>

        <div className="flex flex-col gap-2">
          <p>Cloud Integration</p>
          <WarningSign
            message="Cloud integration is not available for now."
            iconSize={20}
            iconClassName="mt-0.5"
          />
          <Button size="lg" variant="secondary" type="button" disabled>
            Connect
          </Button>
          <p className="text-sm text-muted-foreground">
            Connect your system to cloud storage services like Google Drive or
            Dropbox for automatic backup syncing.
          </p>
        </div>

        {hasPermission && (
          <form.Subscribe
            selector={(state) => [state.canSubmit]}
            children={([canSubmit]) => (
              <SaveChangesButton
                id="backup-form"
                action={updateOrgSettings}
                disabled={!canSubmit}
                open={confirmation}
                onOpenChange={setConfirmationOpen}
              />
            )}
          />
        )}
      </form>
    </SettingsLayout>
  );
}
