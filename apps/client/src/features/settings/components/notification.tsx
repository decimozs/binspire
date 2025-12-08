import { MessagingApi } from "@binspire/query";
import { Switch } from "@binspire/ui/components/switch";
import { getToken } from "firebase/messaging";
import { Bell } from "lucide-react";
import { useEffect, useState } from "react";
import { ShowToast } from "@/components/toast";
import { useSession } from "@/features/auth";
import { messaging } from "@/features/firebase";

export default function ToggleNotification() {
  const session = useSession();
  const currentUser = session.data?.user;
  const [, setToken] = useState<string | null>(null);
  const [enabled, setEnabled] = useState<boolean>(false);

  useEffect(() => {
    const saved = localStorage.getItem("notification_enabled");
    if (saved !== null) {
      setEnabled(saved === "true");
    } else {
      setEnabled(Notification.permission === "granted");
    }
  }, []);

  const handleToggle = async (checked: boolean) => {
    setEnabled(checked);
    localStorage.setItem("notification_enabled", checked ? "true" : "false");

    if (!currentUser) return;
    const userId = currentUser.id;

    try {
      if (checked) {
        if (!("Notification" in window)) {
          ShowToast("error", "This browser does not support notifications.");
          setEnabled(false);
          return;
        }

        const permission = await Notification.requestPermission();

        if (permission !== "granted") {
          ShowToast("error", "Notification permission denied.");
          setEnabled(false);
          localStorage.setItem("notification_enabled", "false");
          return;
        }

        const currentToken = await getToken(messaging, {
          vapidKey: import.meta.env.VITE_FIREBASE_VAPID_KEY,
        });

        if (currentToken) {
          await MessagingApi.register(userId, currentToken);
          localStorage.setItem("fcm_token", currentToken);
          setToken(currentToken);
        }

        ShowToast("success", "Notifications enabled!");
      } else {
        localStorage.removeItem("fcm_token");
        ShowToast("info", "Notifications disabled.");
      }
    } catch (e) {
      console.error(e);
      ShowToast("error", "Notification initialization failed.");
      setEnabled(!checked);
      localStorage.setItem("notification_enabled", (!checked).toString());
    }
  };

  return (
    <div className="text-left flex flex-row items-start gap-4">
      <div className="border-accent border-[1px] rounded-md p-2 mt-1">
        <Bell size={30} />
      </div>
      <div>
        <div className="flex flex-row items-center justify-between">
          <p className="font-bold">Notification</p>
          <div className="flex flex-row items-center gap-2">
            <p className="text-sm">{enabled ? "On" : "Off"}</p>
            <Switch checked={enabled} onCheckedChange={handleToggle} />
          </div>
        </div>
        <p className="mt-1 text-muted-foreground leading-4 text-sm font-bold">
          Enable or disable push notifications for important updates and alerts.
        </p>
      </div>
    </div>
  );
}
