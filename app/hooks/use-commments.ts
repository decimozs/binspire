import { useWebSocketContext } from "@/components/provider/websocket-provider";
import { useDashboardLayoutLoader } from "@/routes/dashboard/layout";
import { useEffect } from "react";
import { useCommentStore } from "@/store/comments";

export default function useComments() {
  const loaderData = useDashboardLayoutLoader();
  const { lastMessage } = useWebSocketContext();
  const { comments, addComment, setComments } = useCommentStore();

  useEffect(() => {
    setComments(loaderData?.initalComments ?? []);
  }, []);

  useEffect(() => {
    if (lastMessage !== null) {
      try {
        const parsed = JSON.parse(lastMessage.data);
        if (parsed.transaction === "new-comment") {
          addComment(parsed.data);
        }
      } catch (err) {
        throw err;
      }
    }
  }, [lastMessage]);

  return {
    comments,
  };
}
