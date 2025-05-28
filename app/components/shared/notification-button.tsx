import useNotifications from "@/hooks/use-notifications";
import { Button } from "../ui/button";
import { Bell, BellOff } from "lucide-react";
import { useQueryState } from "nuqs";

export default function NotificationButton() {
  const [isNotificationsEnabled] = useQueryState("is_notifications_enabled", {
    defaultValue: true,
    parse: (val) => val === "true",
    serialize: (val) => String(val),
  });

  const { notifications } = useNotifications();
  const [, setNotificationSheet] = useQueryState("notification", {
    history: "replace",
    parse: (val) => val === "open",
  });

  return (
    <Button
      variant="ghost"
      onClick={() => setNotificationSheet(true)}
      className="relative"
    >
      {isNotificationsEnabled && notifications.length > 0 && (
        <span className="w-[10px] h-[10px] bg-red-500 rounded-full absolute mt-[-0.7rem] mr-[-0.6rem]"></span>
      )}
      {isNotificationsEnabled ? <Bell /> : <BellOff />}
    </Button>
  );
}
