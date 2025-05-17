import {
  Sheet,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { useQueryState } from "nuqs";
import { ReviewActivityLogContent, SheetContainer } from "./sheet-content";
import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import type { Activity } from "@/lib/types";
import type { FetcherWithComponents } from "react-router";

export default function ReviewActivity({
  username,
  fetcher,
}: {
  username: string;
  fetcher: FetcherWithComponents<any>;
}) {
  const [activityId, setActivity] = useQueryState("activity", {
    history: "replace",
  });
  const [replyCommentId, setReplyCommentId] = useState<string | null>(null);
  const [replyMessage, setReplyMessage] = useState("");
  const [newReplyMessage, setNewReplyMessage] = useState("");
  const [commentMessage, setCommentMessage] = useState("");
  const [viewReplies, setViewReplies] = useState<string | null>(null);
  const { data, isLoading, error } = useQuery<Activity>({
    queryKey: ["activity", activityId],
    queryFn: async () => {
      const response = await fetch(`/activities/${activityId}`);
      if (!response.ok) {
        throw new Error("Failed to fetch activity");
      }
      return response.json();
    },
    enabled: !!activityId,
  });
  const [isClosing, setIsClosing] = useState(false);

  const open = Boolean(activityId) && !isClosing;

  const handleOpenChange = async (isOpen: boolean) => {
    if (!isOpen) {
      setIsClosing(true);
      await new Promise((resolve) => setTimeout(resolve, 300));
      setActivity(null);
      setIsClosing(false);
    }
  };

  useEffect(() => {
    console.log(data);
    console.log("fetcher data: ", fetcher.data);
  }, [data]);

  return (
    <Sheet open={open} onOpenChange={handleOpenChange}>
      <SheetContainer>
        <SheetHeader>
          <SheetTitle>Are you absolutely sure?</SheetTitle>
          <SheetDescription>{activityId}</SheetDescription>
        </SheetHeader>
        {Array.isArray(data) ? (
          data.map((item, index) => (
            <ReviewActivityLogContent
              key={index}
              data={item}
              fetcher={fetcher}
              username={username}
              replyMessage={replyMessage}
              setReplyMessage={setReplyMessage}
              replyCommentId={replyCommentId}
              setReplyCommentId={setReplyCommentId}
              setCommentMessage={setCommentMessage}
              commentMessage={commentMessage}
              setNewReplyMessage={setNewReplyMessage}
              newReplyMessage={newReplyMessage}
              viewReplies={viewReplies}
              setViewReplies={setViewReplies}
            />
          ))
        ) : (
          <div>Loading...</div>
        )}
      </SheetContainer>
    </Sheet>
  );
}
