import type { loader } from "@/routes/dashboard/layout";
import { useEffect, useState } from "react";
import { useLoaderData } from "react-router";
import useWebSocket from "react-use-websocket";

export default function useActiveTeams() {
  const { onlineAdmins, onlineCollectors } = useLoaderData<typeof loader>();
  const [activeAdmins, setActiveAdmins] = useState(onlineAdmins);
  const [activeCollectors, setActiveCollectors] = useState(onlineCollectors);
  const { lastMessage } = useWebSocket("ws://localhost:5173/ws");

  useEffect(() => {
    if (lastMessage !== null) {
      try {
        const parsed = JSON.parse(lastMessage.data);
        console.log(parsed);
        if (parsed.transaction === "active-users") {
          setActiveAdmins(parsed.activeAdmins);
          setActiveCollectors(parsed.activeCollectors);
          console.log(parsed);
        }
      } catch (err) {
        console.error("WebSocket message parsing error:", err);
      }
    }
  }, [lastMessage]);

  return {
    activeAdmins,
    activeCollectors,
  };
}
