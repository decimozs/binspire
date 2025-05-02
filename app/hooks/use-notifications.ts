import type { loader } from "@/routes/dashboard/layout";
import { useEffect, useState } from "react";
import { useLoaderData } from "react-router";
import useWebSocket from "react-use-websocket";

export default function useNotifications() {
  const { notifications, userId } = useLoaderData<typeof loader>();
  const [notificationsCount, setNotifications] = useState(notifications.length);
  const { lastMessage } = useWebSocket("ws://localhost:5173/ws");

  useEffect(() => {
    if (lastMessage !== null) {
      try {
        const parsed = JSON.parse(lastMessage.data);
        console.log(parsed);
        if (
          parsed.transaction === "notifications" &&
          parsed.userId !== userId
        ) {
          setNotifications(parsed.notificationsLength);
          console.log("notifications length: ", notificationsCount);
        }
      } catch (err) {
        console.error("WebSocket message parsing error:", err);
      }
    }
  }, [lastMessage]);

  return {
    notificationsCount,
  };
}
