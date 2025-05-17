import { useDashboardLayoutLoader } from "@/routes/dashboard/layout";
import { useActiveUsersStore } from "@/store/active-users.store";
import { useWebsocketStore } from "@/store/websocket.store";
import { useEffect } from "react";

export default function useActiveTeams() {
  const loaderData = useDashboardLayoutLoader();
  const {
    activeAdmins,
    activeCollectors,
    setActiveCollectors,
    setActiveAdmins,
    incrementActiveCollectors,
    incrementActiveAdmins,
    decrementActiveAdmins,
    decrementActiveCollectors,
  } = useActiveUsersStore();
  const lastMessage = useWebsocketStore((s) => s.lastMessage);

  useEffect(() => {
    setActiveAdmins(loaderData?.onlineAdmins || 0);
    setActiveCollectors(loaderData?.onlineCollectors || 0);
  }, []);

  useEffect(() => {
    if (lastMessage !== null) {
      try {
        const parsed = JSON.parse(lastMessage.data);
        if (parsed.transaction === "admin-login") incrementActiveAdmins();
        if (parsed.transaction === "admin-logout") decrementActiveAdmins();
        if (parsed.transaction === "collector-login")
          incrementActiveCollectors();
        if (parsed.transaction === "collector-logout")
          decrementActiveCollectors();
      } catch (err) {
        throw err;
      }
    }
  }, [lastMessage]);

  return {
    activeAdmins,
    activeCollectors,
  };
}
