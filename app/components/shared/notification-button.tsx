import useNotifications from "@/hooks/use-notifications";
import { Button } from "../ui/button";
import { Bell } from "lucide-react";
import { useQueryState } from "nuqs";

export default function NotificationButton() {
  const { notifications } = useNotifications();
  const [, setNotificationSheet] = useQueryState("notification", {
    history: "replace",
    parse: (val) => val === "open",
  });

  return (
    <Button variant="ghost" onClick={() => setNotificationSheet(true)}>
      {notifications.length > 0 && (
        <span className="w-[10px] h-[10px] bg-red-500 rounded-[50%] absolute mt-[-0.7rem] mr-[-0.6rem]"></span>
      )}
      <Bell />
    </Button>
  );
}
