import LanguageSettings from "@/components/settings/language-settings";
import { Button } from "@/components/ui/button";
import { Globe, Clock, Bell, Lock, ShieldCheck } from "lucide-react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogClose,
  DialogFooter,
} from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { useState } from "react";
import TimezoneSettings from "@/components/settings/timezone-settings";
import SecuritySettings from "@/components/settings/security-settings";
import PrivacySettings from "@/components/settings/privacy-settings";
import { useDashboardLayoutLoader } from "../layout";
import type { Role } from "@/lib/types";

export default function GeneralSettingsRoute() {
  const loaderData = useDashboardLayoutLoader();
  const userRole = loaderData?.user?.role as Role;

  return (
    <div className="flex flex-col gap-6 max-w-2xl">
      <h1 className="text-3xl font-semibold">General</h1>

      <SettingRow
        icon={<Globe />}
        title="Language"
        description="Choose the default language used across the system interface."
        actionLabel="Change"
      />

      <SettingRow
        icon={<Clock />}
        title="Timezone"
        description="Set the timezone used for logging, timestamps, and scheduling."
        actionLabel="Change"
      />

      <SettingRow
        icon={<Bell />}
        title="Notifications"
        description="Manage system alert preferences, email updates, and reminders."
        actionLabel="Change"
      />

      {userRole !== "collector" && (
        <>
          <SettingRow
            icon={<Lock />}
            title="Security"
            description="Review security settings including session timeouts and password policies."
            actionLabel="Change"
          />

          <SettingRow
            icon={<ShieldCheck />}
            title="Privacy"
            description="Control data visibility, telemetry, and user consent options."
            actionLabel="Change"
          />
        </>
      )}
    </div>
  );
}

function SettingRow({
  icon,
  title,
  description,
  actionLabel,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  actionLabel: string;
}) {
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  if (title === "Notifications") {
    return (
      <div className="flex flex-row gap-4 items-center">
        <div className="border-input border-[1px] border-dashed rounded-md p-4">
          {icon}
        </div>
        <div className="flex flex-col flex-1">
          <p className="font-medium">{title}</p>
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>
        <div className="ml-4">
          <Switch
            checked={notificationsEnabled}
            onCheckedChange={setNotificationsEnabled}
            aria-label="Toggle High Contrast Mode"
          />
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-row gap-4 items-center">
      <div className="border-input border-[1px] border-dashed rounded-md p-4">
        {icon}
      </div>
      <div className="flex flex-col flex-1">
        <p className="font-medium">{title}</p>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
      <div className="ml-4">
        <Dialog>
          <DialogTrigger asChild>
            <Button>{actionLabel}</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{title}</DialogTitle>
              <DialogDescription>{description}</DialogDescription>
            </DialogHeader>
            <SettingDialogContent setting={title} />
            <DialogFooter>
              <DialogClose asChild>
                <Button type="button">Apply Changes</Button>
              </DialogClose>
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
}

function SettingDialogContent({ setting }: { setting: string }) {
  switch (setting) {
    case "Language":
      return <LanguageSettings />;
    case "Timezone":
      return <TimezoneSettings />;
    case "Security":
      return <SecuritySettings />;
    case "Privacy":
      return <PrivacySettings />;
    default:
      return <p>No settings available.</p>;
  }
}
