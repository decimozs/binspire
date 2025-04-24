import type { User, UserActivity, UserComment } from "@/lib/types";
import { useQuery } from "@tanstack/react-query";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Calendar,
  CornerDownRight,
  Ellipsis,
  KeyRound,
  Loader2,
  Mail,
  Phone,
  Reply,
  Send,
  Trash,
  UsersRound,
} from "lucide-react";
import {
  fallbackInitials,
  formatDate,
  formatPermission,
  formatRelativeTime,
} from "@/lib/utils";
import { tableRowColumns } from "@/lib/constants";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import SearchBar from "@/components/shared/search-bar";
import { useQueryState } from "nuqs";
import { usePagination } from "@/hooks/use-pagination";
import { PaginationControls } from "@/components/shared/pagination";
import { DynamicActiveBadge } from "@/components/shared/dynamic-badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { DialogClose } from "@radix-ui/react-dialog";
import { useFetcher } from "react-router";
import { toast } from "sonner";
import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { FormField, FormTextArea } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

export default function UserInfo({
  user,
  activity,
}: {
  user?: User;
  activity?: UserActivity[];
}) {
  const { data } = useQuery({
    queryKey: ["user", user?.id],
    queryFn: () => user,
  });
  const { data: activityData } = useQuery({
    queryKey: ["user-activities", user?.id],
    queryFn: () => activity,
  });
  console.log(activityData);
  const fetcher = useFetcher();
  const [deleteDialog, setDeleteDialog] = useState(false);
  const [replyCommentId, setReplyCommentId] = useState<string | null>(null);
  const [replyMessage, setReplyMessage] = useState("");
  const [newReplyMessage, setNewReplyMessage] = useState("");
  const [commentMessage, setCommentMessage] = useState("");
  const [viewReplies, setViewReplies] = useState<string | null>(null);
  const [searchActivity, setSearchActivity] = useQueryState("activity");
  const [page, setPage] = useQueryState("page", {
    history: "push",
    defaultValue: "1",
  });
  const [limit, setLimit] = useQueryState("limit", {
    history: "push",
    defaultValue: "10",
  });
  const pageNumber = parseInt(page || "1", 10);
  const pageSize = parseInt(limit || "10", 10);

  const filteredData = activityData?.filter((data) => {
    const query = (searchActivity || "").toLowerCase();
    return (
      data.name?.toLowerCase().includes(query) ||
      data.type?.toLowerCase().includes(query) ||
      data.reason?.toLowerCase().includes(query) ||
      data.status?.toLowerCase().includes(query)
    );
  });

  const { paginatedData, safePage, totalPages, totalItems } = usePagination(
    filteredData as UserActivity[],
    pageNumber,
    pageSize,
  );

  useEffect(() => {
    if (fetcher.data?.success && fetcher.data?.intent === "delete") {
      toast.success("Activity Deleted");
      setDeleteDialog(false);
    }

    if (fetcher.data?.success && fetcher.data?.intent === "reply") {
      setReplyMessage("");
      setReplyCommentId(null);
    }

    if (fetcher.data?.success && fetcher.data?.intent === "new-reply") {
      setViewReplies(fetcher.data?.commentId);
      setNewReplyMessage("");
      setReplyCommentId(null);
    }

    if (fetcher.data?.success && fetcher.data?.intent === "comment") {
      setCommentMessage("");
    }
  }, [fetcher.data]);

  return (
    <div className="w-full h-full lg:flex lg:items-center lg:flex-col">
      <div className="w-full max-w-3xl">
        <div className="bg-muted-foreground w-full h-[150px] rounded-md"></div>
        <div className="relative">
          <Avatar className="ml-5 h-[120px] w-[120px] absolute top-[-4rem]">
            <AvatarImage src={data?.image as string} alt="@shadcn" />
            <AvatarFallback>
              {fallbackInitials(data?.name as string)}
            </AvatarFallback>
          </Avatar>
        </div>
      </div>
      <div className="w-full max-w-3xl mt-18 flex flex-col gap-3">
        <div className="flex flex-row items-center gap-4">
          <p className="text-2xl">{data?.name}</p>
          <DynamicActiveBadge isOnline={data?.isOnline as boolean} />
        </div>
        <div className="flex flex-col gap-1">
          <p className="text-sm flex flex-row gap-2 items-center text-muted-foreground">
            <Mail size={15} className="mt-[0.1rem]" />
            {data?.email}
          </p>
          <p className="text-sm flex flex-row gap-2 items-center text-muted-foreground capitalize">
            <UsersRound size={15} className="mt-[0.1rem]" />
            {data?.role}
          </p>
          <p className="text-sm flex flex-row gap-2 items-center text-muted-foreground">
            <KeyRound size={15} className="mt-[0.1rem]" />
            {formatPermission(data?.permission as string)}
          </p>
          <p className="text-sm flex flex-row gap-2 items-center text-muted-foreground">
            <Calendar size={15} className="mt-[0.1rem]" />
            Joined on {formatDate(data?.createdAt as Date)}
          </p>
        </div>
        <div className="flex flex-col gap-2">
          <p className="text-xl mt-3">User Activity</p>
          {paginatedData.length === 0 ? (
            <div className="flexb border-input border-dashed border-[1px] p-4 rounded-md justify-center items-center">
              <p className="text-sm text-muted-foreground text-center">
                This user does not have any activity right now.
              </p>
            </div>
          ) : (
            <div>
              <SearchBar
                value={searchActivity || ""}
                onChange={(val) => {
                  setSearchActivity(val);
                  setPage("1");
                }}
                placeholder="What are you looking for?"
              />
              <PaginationControls
                currentPage={safePage}
                totalPages={totalPages}
                totalResults={totalItems}
                onPageChange={(newPage) => setPage(String(newPage))}
              />
            </div>
          )}
          <div className="flex flex-col gap-2 overflow-auto">
            {paginatedData.map((item) => (
              <div className="p-4 border-input border-[1px] rounded-md flex flex-row items-center justify-between">
                <div
                  className="grid overflow-auto items-center lg:grid-cols-[300px_200px]"
                  key={item.id}
                >
                  <div>
                    <Badge className="capitalize mr-2 mb-2">{item.type}</Badge>
                    <Badge className="capitalize mb-2">{item.status}</Badge>
                    <p>{item.name}</p>
                    <p className="text-muted-foreground text-sm">
                      {formatDate(item.createdAt as Date)}
                    </p>
                  </div>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost">
                      <Ellipsis />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="mr-[7rem] mt-[-1rem]">
                    <DropdownMenuItem asChild>
                      <Sheet>
                        <SheetTrigger asChild>
                          <Button
                            variant="ghost"
                            className="p-2 text-sm w-fit font-normal"
                          >
                            Review
                          </Button>
                        </SheetTrigger>
                        <SheetContent
                          className="sm:max-w-md md:max-w-3xl overflow-y-auto"
                          showOverlay={false}
                          onOpenAutoFocus={(event) => {
                            event.preventDefault();
                          }}
                        >
                          <SheetHeader>
                            <SheetTitle>Review</SheetTitle>
                            <SheetDescription>
                              This action cannot be undone. This will
                              permanently delete your account and remove your
                              data from our servers.
                            </SheetDescription>
                          </SheetHeader>
                          <div className="mx-4 border-input border-[1px] rounded-md p-4">
                            <div className="flex flex-row items-center justify-between">
                              <p className="font-bold">Activity</p>
                              <Badge className="capitalize">
                                {item.status}
                              </Badge>
                            </div>
                            <div className="flex items-center justify-center">
                              <div className="rounded-[50%] bg-muted-foreground h-[80px] w-[80px] flex items-center justify-center">
                                <p>{item.name}</p>
                              </div>
                            </div>
                            <div className="mt-4 flex justify-center items-center flex-col">
                              <p className="text-center">{item.type}</p>
                              <p className="text-center">{item.reason}</p>
                              <p className="text-muted-foreground text-sm">
                                Requested on{" "}
                                {new Date(item.createdAt).toLocaleString(
                                  "en-US",
                                  {
                                    month: "long",
                                    day: "numeric",
                                    year: "numeric",
                                    hour: "numeric",
                                    minute: "2-digit",
                                    hour12: true,
                                  },
                                )}
                              </p>
                            </div>
                          </div>
                          <div className="mx-4 border-input border-[1px] rounded-md p-4 flex flex-col min-h-0">
                            <div className="flex flex-row items-center justify-between">
                              <p className="font-bold">Comments</p>
                              <p className="text-sm text-muted-foreground">
                                {item.comments.length === 0
                                  ? "No comments"
                                  : `${item.comments.length} Comments`}
                              </p>
                            </div>
                            <div className="mt-4 flex flex-col gap-4 overflow-auto min-h-0">
                              {item.comments.map((item) => (
                                <div
                                  key={item.id}
                                  className="flex flex-row gap-4 border-input border-dashed border-[1px] p-4 rounded-md"
                                >
                                  <Avatar className="h-[40px] w-[40px]">
                                    <AvatarImage src={item.user.image} />
                                    <AvatarFallback>CN</AvatarFallback>
                                  </Avatar>
                                  <div className="w-full">
                                    <p className="text-sm">{item.user.name}</p>
                                    <div className="bg-muted/50 mt-1 p-4 text-sm rounded-md w-full">
                                      <p>{item.message}</p>
                                    </div>
                                    <div className="flex flex-row items-center justify-between mt-1">
                                      <div className="flex flex-row gap-2">
                                        <Button
                                          className="text-sm text-muted-foreground flex flex-row items-center gap-2"
                                          variant="ghost"
                                          onClick={() => {
                                            if (item.replies.length === 0) {
                                              setReplyCommentId(
                                                replyCommentId === item.id
                                                  ? null
                                                  : item.id,
                                              );
                                            } else {
                                              setViewReplies(
                                                viewReplies === item.id
                                                  ? null
                                                  : item.id,
                                              );
                                            }
                                          }}
                                        >
                                          <Reply size={15} />
                                          {item.replies.length === 0
                                            ? "Reply"
                                            : "View replies"}
                                        </Button>
                                        <Dialog>
                                          <DialogTrigger asChild>
                                            <Button
                                              variant="ghost"
                                              className="text-sm text-muted-foreground flex flex-row items-center gap-2"
                                              type="submit"
                                            >
                                              {fetcher.state ===
                                              "submitting" ? (
                                                <Loader2 className="animate-spin" />
                                              ) : (
                                                <Trash size={15} />
                                              )}
                                              Delete
                                            </Button>
                                          </DialogTrigger>
                                          <DialogContent>
                                            <DialogHeader>
                                              <DialogTitle>
                                                Are you absolutely sure to
                                                delete this comment?
                                              </DialogTitle>
                                              <DialogDescription>
                                                This action cannot be undone.
                                                This will permanently delete
                                                your comment.
                                              </DialogDescription>
                                            </DialogHeader>
                                            <DialogFooter>
                                              <fetcher.Form
                                                method="post"
                                                action={`/dashboard/user/management/profile/${item.id}`}
                                              >
                                                <input
                                                  type="hidden"
                                                  name="intent"
                                                  value="delete-comment"
                                                />
                                                <input
                                                  type="hidden"
                                                  name="commentId"
                                                  value={item.id}
                                                />
                                                <Button
                                                  type="submit"
                                                  disabled={
                                                    fetcher.state ===
                                                    "submitting"
                                                  }
                                                >
                                                  {fetcher.state !==
                                                  "submitting"
                                                    ? "Confirm"
                                                    : "Deleting..."}
                                                </Button>
                                              </fetcher.Form>
                                              <DialogClose asChild>
                                                <Button variant="outline">
                                                  Cancel
                                                </Button>
                                              </DialogClose>
                                            </DialogFooter>
                                          </DialogContent>
                                        </Dialog>
                                      </div>
                                      <p className="text-sm text-muted-foreground">
                                        {formatRelativeTime(item.createdAt)}
                                      </p>
                                    </div>
                                    {replyCommentId === item.id && (
                                      <fetcher.Form
                                        className="flex items-center flex-row gap-2 w-full"
                                        method="POST"
                                        action={`/dashboard/user/management/profile/${item.id}`}
                                      >
                                        <div className="w-full">
                                          <Label className="mb-2 text-sm text-muted-foreground">
                                            Add reply
                                          </Label>
                                          <Textarea
                                            id="reply"
                                            name="reply"
                                            value={newReplyMessage}
                                            placeholder={`Reply as ${item.user.name}`}
                                            onChange={(e) =>
                                              setNewReplyMessage(e.target.value)
                                            }
                                          />
                                          <input
                                            type="hidden"
                                            name="intent"
                                            value="new-reply"
                                          />
                                          <input
                                            type="hidden"
                                            name="commentId"
                                            value={item.id}
                                          />
                                        </div>
                                        <Button
                                          variant="ghost"
                                          className="mt-4"
                                          type="submit"
                                        >
                                          {fetcher.state === "submitting" ? (
                                            <Loader2 className="animate-spin" />
                                          ) : (
                                            <Send />
                                          )}
                                        </Button>
                                      </fetcher.Form>
                                    )}
                                    {viewReplies === item.id &&
                                      item.replies.map((item) => (
                                        <div
                                          className="flex flex-col gap-2 mt-2"
                                          key={item.id}
                                        >
                                          <div className="flex flex-row gap-4">
                                            <div className="flex flex-row gap-2">
                                              <CornerDownRight
                                                size={15}
                                                className="text-muted-foreground mt-1"
                                              />
                                              <Avatar className="h-[30px] w-[30px]">
                                                <AvatarImage
                                                  src={item.user.image}
                                                />
                                                <AvatarFallback>
                                                  {fallbackInitials(
                                                    item.user.name,
                                                  )}
                                                </AvatarFallback>
                                              </Avatar>
                                            </div>
                                            <div className="w-full">
                                              <div className="flex flex-row gap-2 items-center">
                                                <div className="text-sm">
                                                  <p className="text-sm text-muted-foreground">
                                                    Replies to {item.user.name}
                                                  </p>
                                                  <p>{item.user.name}</p>
                                                </div>
                                              </div>
                                              <div className="bg-muted/50 mt-1 p-4 text-sm rounded-md w-full">
                                                <p>{item.message}</p>
                                              </div>
                                              <div className="mt-1 flex flex-row justify-between items-center">
                                                <Button
                                                  className="text-sm text-muted-foreground flex flex-row items-center gap-2"
                                                  variant="ghost"
                                                  onClick={() =>
                                                    setReplyCommentId(
                                                      replyCommentId === item.id
                                                        ? null
                                                        : item.id,
                                                    )
                                                  }
                                                >
                                                  <Reply size={15} />
                                                  Reply
                                                </Button>
                                                <p className="text-sm text-muted-foreground">
                                                  {formatRelativeTime(
                                                    item.createdAt,
                                                  )}
                                                </p>
                                              </div>
                                              {replyCommentId === item.id && (
                                                <fetcher.Form
                                                  className="flex items-center flex-row gap-2 w-full"
                                                  method="POST"
                                                  action={`/dashboard/user/management/profile/${item.id}`}
                                                >
                                                  <div className="w-full">
                                                    <Label className="mb-2 text-sm text-muted-foreground">
                                                      Add reply
                                                    </Label>
                                                    <Textarea
                                                      id="reply"
                                                      name="reply"
                                                      value={replyMessage}
                                                      placeholder={`Reply as ${item.user.name}`}
                                                      onChange={(e) =>
                                                        setReplyMessage(
                                                          e.target.value,
                                                        )
                                                      }
                                                    />
                                                    <input
                                                      type="hidden"
                                                      name="intent"
                                                      value="reply"
                                                    />
                                                    <input
                                                      type="hidden"
                                                      name="commentId"
                                                      value={item.commentId}
                                                    />
                                                  </div>
                                                  <Button
                                                    variant="ghost"
                                                    className="mt-4"
                                                    type="submit"
                                                  >
                                                    {fetcher.state ===
                                                    "submitting" ? (
                                                      <Loader2 className="animate-spin" />
                                                    ) : (
                                                      <Send />
                                                    )}
                                                  </Button>
                                                </fetcher.Form>
                                              )}
                                            </div>
                                          </div>
                                        </div>
                                      ))}
                                  </div>
                                </div>
                              ))}
                            </div>
                            <SheetFooter className="p-0 pt-4">
                              <fetcher.Form
                                className="flex items-center flex-row gap-2 w-full"
                                method="POST"
                                action={`/dashboard/user/management/profile/${item.id}`}
                              >
                                <div className="w-full">
                                  <Label className="mb-2">Add comment</Label>
                                  <Textarea
                                    id="comment"
                                    name="comment"
                                    value={commentMessage}
                                    onChange={(e) =>
                                      setCommentMessage(e.target.value)
                                    }
                                    placeholder={`Comment as ${item.comments.find((comment) => comment.user.name)?.user?.name}`}
                                    className="w-full"
                                  />
                                  <input
                                    type="hidden"
                                    name="intent"
                                    value="comment"
                                  />
                                  <input
                                    type="hidden"
                                    name="activityId"
                                    value={item.id}
                                  />
                                </div>
                                <Button
                                  variant="ghost"
                                  className="mt-4"
                                  type="submit"
                                >
                                  {fetcher.state === "submitting" ? (
                                    <Loader2 className="animate-spin" />
                                  ) : (
                                    <Send />
                                  )}
                                </Button>
                              </fetcher.Form>
                            </SheetFooter>
                          </div>
                        </SheetContent>
                      </Sheet>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Dialog
                        open={deleteDialog}
                        onOpenChange={setDeleteDialog}
                      >
                        <DialogTrigger asChild>
                          <Button
                            variant="ghost"
                            className="p-2 text-sm w-fit font-normal"
                          >
                            Delete
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Delete Activity History</DialogTitle>
                            <DialogDescription>
                              This action cannot be undone. It will permanently
                              delete your activity history and remove all
                              associated data from our servers.
                            </DialogDescription>
                          </DialogHeader>
                          <DialogFooter>
                            <fetcher.Form
                              method="post"
                              action={`/dashboard/user/management/profile/${item.id}`}
                            >
                              <input
                                type="hidden"
                                name="intent"
                                value="delete"
                              />
                              <input
                                type="hidden"
                                name="activityId"
                                value={item.id}
                              />
                              <Button
                                type="submit"
                                disabled={fetcher.state === "submitting"}
                              >
                                {fetcher.state !== "submitting"
                                  ? "Confirm"
                                  : "Deleting..."}
                              </Button>
                            </fetcher.Form>
                            <DialogClose asChild>
                              <Button variant="outline">Cancel</Button>
                            </DialogClose>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
