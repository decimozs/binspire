import { useUpdateIssue, type Issue } from "@binspire/query";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@binspire/ui/components/avatar";
import { IssuePriorityBadge, IssueStatusBadge } from "@binspire/ui/badges";
import { Button } from "@binspire/ui/components/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@binspire/ui/components/sheet";
import { format, formatDistanceToNow } from "date-fns";
import { getInitial } from "@binspire/shared";
import { useState } from "react";
import { Loader2 } from "lucide-react";
import { ShowToast } from "@/components/toast";

export default function ViewTrashbinIssue({ issue }: { issue: Issue }) {
  const action = useUpdateIssue();
  const { mutateAsync, isPending } = action;
  const [open, setOpen] = useState(false);

  const handleUpdateIssue = async () => {
    try {
      await mutateAsync({
        id: issue.id,
        data: {
          status: "resolved",
        },
      });

      ShowToast("success", "Issue has been marked as resolved.");
      setOpen(false);
    } catch {
      ShowToast("error", "Failed to update the issue. Please try again.");
    }
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <div key={issue.id} className="bg-accent/20 rounded-md p-4">
          <div className="flex flex-row items-center justify-between">
            <p className="font-bold text-3xl">Issue # {issue.no}</p>
            <IssuePriorityBadge priority={issue.priority} />
          </div>
          <div className="text-sm text-muted-foreground">
            <p className="max-w-md truncate">{issue.title}</p>
          </div>
          <p className="font-bold text-muted-foreground text-right">
            {formatDistanceToNow(new Date(issue.createdAt), {
              addSuffix: true,
            })}
          </p>
        </div>
      </SheetTrigger>
      <SheetContent className="w-full font-bold">
        <SheetHeader>
          <SheetTitle className="text-4xl">Issue # {issue.no}</SheetTitle>
          <SheetDescription>
            Review the details of this trashbin issue below.
          </SheetDescription>
        </SheetHeader>
        <div className="px-4 grid grid-cols-1 gap-2">
          <div className="text-xl font-bold">
            <p>Title</p>
            <p className="text-muted-foreground">
              {issue.title || "No title provided"}
            </p>
          </div>
          <div className="text-xl font-bold">
            <p>Description</p>
            <p className="text-muted-foreground">
              {issue.description || "No description provided"}
            </p>
          </div>
          <div className="flex flex-row items-center justify-between text-xl font-bold mt-2">
            <p>Status</p>
            <IssueStatusBadge status={issue.status} />
          </div>
          <div className="flex flex-row items-center justify-between text-xl font-bold">
            <p>Priority</p>
            <IssuePriorityBadge priority={issue.priority} />
          </div>
          <div className="text-xl font-bold mt-2">
            <p>Created At</p>
            <p className="text-muted-foreground">
              {format(new Date(issue.createdAt), "MMMM dd, yyyy - hh:mm a")}
            </p>
          </div>
          <div className="text-xl font-bold mt-2">
            <p>Last update</p>
            <p className="text-muted-foreground">
              {formatDistanceToNow(new Date(issue.createdAt), {
                addSuffix: true,
              })}
            </p>
          </div>
        </div>
        <SheetFooter>
          <div className="mb-4">
            <p className="text-xl font-bold mb-1">Issued By</p>
            <div className="flex flex-row gap-2">
              <Avatar className="size-15">
                <AvatarImage src={issue.user.image || ""} />
                <AvatarFallback>{getInitial(issue.user.name)}</AvatarFallback>
              </Avatar>
              <div className="text-xl font-bold">
                <p>{issue.user.name}</p>
                <p className="text-muted-foreground">{issue.user.email}</p>
              </div>
            </div>
          </div>
          <Button
            onClick={handleUpdateIssue}
            className="w-full font-bold text-lg"
            disabled={isPending || issue.status === "resolved"}
          >
            {isPending ? <Loader2 className="animate-spin" /> : "Resolved"}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
