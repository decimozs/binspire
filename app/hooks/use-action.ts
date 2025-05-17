import { useWebsocketStore } from "@/store/websocket.store";
import { useDashboardLayoutLoader } from "@/routes/dashboard/layout";
import { useActionStore } from "@/store/action.store";
import { useEffect } from "react";

export default function useAction() {
  const loaderData = useDashboardLayoutLoader();
  const lastMessage = useWebsocketStore((s) => s.lastMessage);
  const { actionMade, resetActionMade, incrementActionMade } = useActionStore();

  useEffect(() => {
    if (lastMessage !== null) {
      try {
        const parsed = JSON.parse(lastMessage.data);
        if (
          parsed.transaction === "action-made" &&
          parsed.userId !== loaderData?.userId
        )
          incrementActionMade();
      } catch (err) {
        throw err;
      }
    }
  }, [lastMessage]);

  return {
    actionMade,
    resetActionMade,
  };
}
