import { useEffect } from "react";
import { useDashboardLayoutLoader } from "@/routes/dashboard/layout";
import { useNotificationStore } from "@/store/notifications";
import { useWebsocketStore } from "@/store/websocket";

export default function useNotifications() {
  const loaderData = useDashboardLayoutLoader();
  const lastMessage = useWebsocketStore((s) => s.lastMessage);
  const { notifications, addNotification, setNotifications } =
    useNotificationStore();

  useEffect(() => {
    setNotifications(loaderData?.initialNotifications ?? []);
  }, []);

  useEffect(() => {
    if (lastMessage !== null) {
      try {
        const parsed = JSON.parse(lastMessage.data);
        if (
          parsed.transaction === "new-notification" &&
          parsed.userId !== loaderData?.userId
        ) {
          addNotification(parsed.data);
        }
      } catch (err) {
        throw err;
      }
    }
  }, [lastMessage]);

  return {
    notifications,
  };
}
