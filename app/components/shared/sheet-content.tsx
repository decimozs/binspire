import {
  ArrowRight,
  Calendar,
  Check,
  CircleAlert,
  CircleArrowUp,
  CircleCheck,
  CircleX,
  CornerDownRight,
  Eraser,
  History,
  Loader2,
  Mail,
  MapPin,
  Phone,
  Reply,
  Send,
  Settings,
  Timer,
  Trash,
  type LucideIcon,
} from "lucide-react";
import { Badge } from "../ui/badge";
import {
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "../ui/sheet";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import {
  fallbackInitials,
  formatDate,
  formatRelativeTime,
  parsedJSON,
} from "@/lib/utils";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Button } from "../ui/button";
import {
  ApproveUserAccessRequestContent,
  RejectUserAccessRequestContent,
} from "./dialog-content";
import type {
  Action,
  Permission,
  AccessRequests,
  ActivityLogs,
  ActivityLog,
} from "@/lib/types";
import {
  useFetcher,
  useNavigate,
  type FetcherWithComponents,
} from "react-router";
import { useEffect, useState, type ReactNode } from "react";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import { actionIcons, permissionIcons } from "@/lib/constants";
import { useNotificationStore } from "@/store/notifications.store";
import { useDashboardLayoutLoader } from "@/routes/dashboard/layout";
import { rpc } from "@/lib/rpc";
import { useQueryState } from "nuqs";

const SheetContainer = ({ children }: { children: ReactNode }) => {
  return (
    <SheetContent
      className="sm:max-w-md md:max-w-2xl overflow-y-auto"
      showOverlay={false}
      onOpenAutoFocus={(event) => {
        event.preventDefault();
      }}
    >
      {children}
    </SheetContent>
  );
};

const ReviewUserAccessRequestContent = ({
  data,
  fetcher,
  openApprovedDialog,
  onOpenChangeApprovedDialog,
  openRejectedDialog,
  onOpenChangeRejectedDialog,
  onSelectedAccess,
  onSetSelectedAccess,
}: {
  data: AccessRequests;
  fetcher: FetcherWithComponents<any>;
  openApprovedDialog: boolean;
  onOpenChangeApprovedDialog: (value: boolean) => void;
  openRejectedDialog: boolean;
  onOpenChangeRejectedDialog: (value: boolean) => void;
  onSelectedAccess: string;
  onSetSelectedAccess: (value: string) => void;
}) => {
  return (
    <SheetContainer>
      <SheetHeader>
        <SheetTitle>Review</SheetTitle>
        <SheetDescription>
          This section displays the user's submitted information, including
          their email and request status. Carefully review the details before
          approving or rejecting the request, as your decision cannot be undone.
        </SheetDescription>
      </SheetHeader>
      <div className="mx-4 border-[1px] border-input rounded-sm p-4">
        <div className="flex flex-col gap-4">
          <div className="flex flex-row items-center justify-between">
            <SheetTitle>User Information</SheetTitle>
            <Badge className="capitalize">
              {data.status === "pending" && (
                <Timer size={15} className="mb-0.5" />
              )}
              {data.status === "rejected" && (
                <CircleX size={15} className="mb-0.5" />
              )}
              {data.status === "approved" && (
                <CircleCheck size={15} className="mb-0.5" />
              )}
              {data.status}
            </Badge>
          </div>
          <div className="grid grid-cols-[70px_1fr] gap-4">
            <Avatar className="w-[60px] h-[60px]">
              <AvatarImage alt="@shadcn" />
              <AvatarFallback>{fallbackInitials(data.name)}</AvatarFallback>
            </Avatar>
            <div>
              <h1 className="text-lg font-medium">{data.name}</h1>
              <p className="text-muted-foreground text-sm capitalize">
                {data.role}
              </p>
            </div>
          </div>
          <div className="flex flex-row gap-8">
            <div className="flex flex-col gap-2">
              <h1 className="text-sm text-muted-foreground">Email</h1>
              <p className="text-sm flex flex-row gap-2 items-center wrap-anywhere">
                <Mail size={15} className="mt-[0.2rem]" />
                {data.email}
              </p>
            </div>
            <div className="flex flex-col gap-2">
              <h1 className="text-sm text-muted-foreground">Phone Number</h1>
              <p className="text-sm flex flex-row gap-2 items-center">
                <Phone size={15} className="mt-[0.2rem]" />
                {!data.phoneNumber ? "Not available" : data.phoneNumber}
              </p>
            </div>
          </div>
        </div>
      </div>
      <div className="mx-4 border-[1px] border-input rounded-sm p-4">
        <div className="flex flex-col gap-4">
          <SheetTitle>Request Details</SheetTitle>
          <p className="text-muted-foreground text-sm mt-[-0.5rem]">
            Requested on{" "}
            {new Date(data.createdAt).toLocaleString("en-US", {
              month: "long",
              day: "numeric",
              year: "numeric",
              hour: "numeric",
              minute: "2-digit",
              hour12: true,
            })}
          </p>
          <p className="text-sm">Reason for Access</p>
          <div className="text-sm border-[1px] border-input p-4 rounded-md bg-muted/50">
            <p className="wrap-anywhere">{data.reason}</p>
          </div>
        </div>
      </div>
      <SheetFooter className="grid grid-cols-2">
        <Dialog
          open={openApprovedDialog}
          onOpenChange={onOpenChangeApprovedDialog}
        >
          <DialogTrigger asChild>
            <Button className="h-12 p-4">
              <CircleCheck className="mt-[0.1rem]" />
              Approve
            </Button>
          </DialogTrigger>
          <ApproveUserAccessRequestContent
            data={data}
            fetcher={fetcher}
            selectedAccess={onSelectedAccess}
            setSelectedAccess={onSetSelectedAccess}
          />
        </Dialog>
        <Dialog
          open={openRejectedDialog}
          onOpenChange={onOpenChangeRejectedDialog}
        >
          <DialogTrigger asChild>
            <Button className="h-12 p-4" variant="outline">
              <CircleX className="mt-[0.1rem]" />
              Reject
            </Button>
          </DialogTrigger>
          <RejectUserAccessRequestContent data={data} fetcher={fetcher} />
        </Dialog>
      </SheetFooter>
    </SheetContainer>
  );
};

const ReviewActivityLogContent = ({
  data,
  fetcher,
  username,
  replyCommentId,
  setReplyCommentId,
  replyMessage,
  setReplyMessage,
  newReplyMessage,
  setNewReplyMessage,
  commentMessage,
  setCommentMessage,
  viewReplies,
  setViewReplies,
}: {
  data: ActivityLogs[number];
  fetcher: FetcherWithComponents<any>;
  username: string;
  replyCommentId: string | null;
  setReplyCommentId: (id: string | null) => void;
  replyMessage: string;
  setReplyMessage: (message: string) => void;
  newReplyMessage: string;
  setNewReplyMessage: (message: string) => void;
  commentMessage: string;
  setCommentMessage: (message: string) => void;
  viewReplies: string | null;
  setViewReplies: (id: string | null) => void;
}) => {
  const PermissionIcon =
    permissionIcons[data.content?.updatedPermisson as Permission];
  const ActionIcons: LucideIcon | undefined =
    actionIcons[data.action as Action];
  return (
    <SheetContainer>
      <SheetHeader>
        <SheetTitle>Review</SheetTitle>
        <SheetDescription>
          This action cannot be undone. This will permanently delete your
          account and remove your data from our servers.
        </SheetDescription>
      </SheetHeader>
      <div className="mx-4 border-input border-[1px] rounded-md p-4">
        <div className="flex flex-row items-center justify-between">
          <div className="flex flex-row items-center gap-2">
            <p className="font-bold">Activity</p>
            <Badge className="capitalize">
              {data.action === "sign-up" ? "Sign up" : data.action}
            </Badge>
            <Badge className="capitalize">{data.status}</Badge>
          </div>
        </div>
        <div className="flex items-center justify-center">
          <div className="flex flex-row justify-center items-center my-4">
            <Avatar className="w-[50px] h-[50px]">
              <AvatarImage
                src={data.content?.modifiedUserImage}
                alt={data.action}
              />
              <AvatarFallback>
                {data.content?.modifiedUserImage as string}
              </AvatarFallback>
            </Avatar>
            <ArrowRight size={17} className="mx-4 text-muted-foreground" />
            <Avatar className="w-[50px] h-[50px]">
              <AvatarImage src={data.action as string} alt={data.action} />
              <AvatarFallback>
                {ActionIcons && <ActionIcons className="h-6 w-6" />}
                {PermissionIcon && <PermissionIcon className="h-6 w-6" />}
              </AvatarFallback>
            </Avatar>
          </div>
        </div>
        <div className="mt-4 flex justify-center items-center flex-col">
          <p className="text-center">{data.description}</p>
          <p className="text-muted-foreground text-sm">
            Modified on{" "}
            {new Date(data.createdAt).toLocaleString("en-US", {
              month: "long",
              day: "numeric",
              year: "numeric",
              hour: "numeric",
              minute: "2-digit",
              hour12: true,
            })}
          </p>
        </div>
      </div>
      <div className="mx-4 border-input border-[1px] rounded-md p-4 flex flex-col min-h-0">
        <div className="flex flex-row items-center justify-between">
          <p className="font-bold">Comments</p>
          <p className="text-sm text-muted-foreground">
            {data.comments.length === 0
              ? "No comments"
              : `${data.comments.length} Comments`}
          </p>
        </div>
        <div className="mt-4 flex flex-col gap-4 overflow-auto min-h-0">
          {data.comments.map((item) => (
            <div
              key={item.id}
              className="flex flex-row gap-4 border-input border-dashed border-[1px] p-4 rounded-md"
            >
              <Avatar className="h-[40px] w-[40px]">
                <AvatarImage src={item.user.image as string} />
                <AvatarFallback>
                  {fallbackInitials(item.user.name)}
                </AvatarFallback>
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
                            replyCommentId === item.id ? null : item.id,
                          );
                        } else {
                          setViewReplies(
                            viewReplies === item.id ? null : item.id,
                          );
                        }
                      }}
                    >
                      <Reply size={15} />
                      {item.replies.length === 0 ? "Reply" : "View replies"}
                    </Button>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button
                          variant="ghost"
                          className="text-sm text-muted-foreground flex flex-row items-center gap-2"
                          type="submit"
                        >
                          {fetcher.state === "submitting" ? (
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
                            Are you absolutely sure to delete this comment?
                          </DialogTitle>
                          <DialogDescription>
                            This action cannot be undone. This will permanently
                            delete your comment.
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
                        placeholder={`Reply as ${username}`}
                        onChange={(e) => setNewReplyMessage(e.target.value)}
                      />
                      <input type="hidden" name="intent" value="new-reply" />
                      <input type="hidden" name="commentId" value={item.id} />
                    </div>
                    <Button variant="ghost" className="mt-4" type="submit">
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
                    <div className="flex flex-col gap-2 mt-2" key={item.id}>
                      <div className="flex flex-row gap-4">
                        <div className="flex flex-row gap-2">
                          <CornerDownRight
                            size={15}
                            className="text-muted-foreground mt-1"
                          />
                          <Avatar className="h-[30px] w-[30px]">
                            <AvatarImage src={item.user.image as string} />
                            <AvatarFallback>
                              {fallbackInitials(item.user.name)}
                            </AvatarFallback>
                          </Avatar>
                        </div>
                        <div className="w-full">
                          <div className="flex flex-row gap-2 items-center">
                            <div className="text-sm">
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
                                  replyCommentId === item.id ? null : item.id,
                                )
                              }
                            >
                              <Reply size={15} />
                              Reply
                            </Button>
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
                                  value={replyMessage}
                                  placeholder={`Reply as ${username}`}
                                  onChange={(e) =>
                                    setReplyMessage(e.target.value)
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
                                {fetcher.state === "submitting" ? (
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
            action={`/dashboard/user/management/profile/${data.id}`}
          >
            <div className="w-full">
              <Label className="mb-2">Add comment</Label>
              <Textarea
                id="comment"
                name="comment"
                value={commentMessage}
                onChange={(e) => setCommentMessage(e.target.value)}
                placeholder={`Comment as ${username}`}
                className="w-full"
              />
              <input type="hidden" name="intent" value="comment" />
              <input type="hidden" name="activityId" value={data.id} />
            </div>
            <Button variant="ghost" className="mt-4" type="submit">
              {fetcher.state === "submitting" ? (
                <Loader2 className="animate-spin" />
              ) : (
                <Send />
              )}
            </Button>
          </fetcher.Form>
        </SheetFooter>
      </div>
    </SheetContainer>
  );
};

const TestReviewActivityLogContent = () => {
  const [activityLog, setActivityLog] = useState<ActivityLog | null>(null);
  const [activityId] = useQueryState("activity");
  const loaderData = useDashboardLayoutLoader();
  const [replyCommentId, setReplyCommentId] = useState<string | null>(null);
  const [viewReplies, setViewReplies] = useState<string | null>(null);
  const [replyMessage, setReplyMessage] = useState("");
  const [newReplyMessage, setNewReplyMessage] = useState("");
  const [commentMessage, setCommentMessage] = useState("");
  const username = loaderData?.currentUser as string;

  const fetcher = useFetcher();

  useEffect(() => {
    if (!activityId) return;

    const fetchActivity = async () => {
      try {
        const response = await rpc.users["activity-logs"]["by-id"][":id"].$get({
          param: {
            id: activityId as string,
          },
        });

        if (response.ok) {
          const { data } = await response.json();
          const activityLog = parsedJSON<ActivityLog>(data);
          setActivityLog(activityLog);
        } else {
          console.error("Failed to fetch activity log");
        }
      } catch (error) {
        console.error("Error fetching activity log", error);
      }
    };

    fetchActivity();
  }, [activityId]);

  useEffect(() => {
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
    <SheetContainer>
      <SheetHeader>
        <SheetTitle>Review</SheetTitle>
        <SheetDescription>
          This action cannot be undone. This will permanently delete your
          account and remove your data from our servers.
        </SheetDescription>
      </SheetHeader>
      <div className="mx-4 border-input border-[1px] rounded-md p-4">
        <div className="flex flex-row items-center justify-between">
          <div className="flex flex-row items-center gap-2">
            <p className="font-bold">Activity</p>
            <Badge className="capitalize">
              {activityLog?.action === "sign-up"
                ? "Sign up"
                : activityLog?.action}
            </Badge>
            <Badge className="capitalize">{activityLog?.status}</Badge>
          </div>
        </div>
        <div className="flex items-center justify-center">
          <div className="flex flex-row justify-center items-center my-4">
            <Avatar className="w-[50px] h-[50px]">
              <AvatarImage
                src={activityLog?.content?.modifiedUserImage}
                alt={activityLog?.action}
              />
              <AvatarFallback>
                {activityLog?.content?.modifiedUserImage as string}
              </AvatarFallback>
            </Avatar>
            <ArrowRight size={17} className="mx-4 text-muted-foreground" />
            <Avatar className="w-[50px] h-[50px]">
              <AvatarImage
                src={activityLog?.action as string}
                alt={activityLog?.action}
              />
              <AvatarFallback>1</AvatarFallback>
            </Avatar>
          </div>
        </div>
        <div className="mt-4 flex justify-center items-center flex-col">
          <p className="text-center">{activityLog?.description}</p>
          <p className="text-muted-foreground text-sm">
            Modified on{" "}
            {new Date(activityLog?.createdAt as Date).toLocaleString("en-US", {
              month: "long",
              day: "numeric",
              year: "numeric",
              hour: "numeric",
              minute: "2-digit",
              hour12: true,
            })}
          </p>
        </div>
      </div>
      <div className="mx-4 border-input border-[1px] rounded-md p-4 flex flex-col min-h-0">
        <div className="flex flex-row items-center justify-between">
          <p className="font-bold">Comments</p>
          <p className="text-sm text-muted-foreground">
            {activityLog?.comments.length === 0
              ? "No comments"
              : `${activityLog?.comments.length} Comments`}
          </p>
        </div>
        <div className="mt-4 flex flex-col gap-4 overflow-auto min-h-0">
          {activityLog?.comments.map((item) => (
            <div
              key={item.id}
              className="flex flex-row gap-4 border-input border-dashed border-[1px] p-4 rounded-md"
            >
              <Avatar className="h-[40px] w-[40px]">
                <AvatarImage src={item.user.image as string} />
                <AvatarFallback>
                  {fallbackInitials(item.user.name)}
                </AvatarFallback>
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
                            replyCommentId === item.id ? null : item.id,
                          );
                        } else {
                          setViewReplies(
                            viewReplies === item.id ? null : item.id,
                          );
                        }
                      }}
                    >
                      <Reply size={15} />
                      {item.replies.length === 0 ? "Reply" : "View replies"}
                    </Button>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button
                          variant="ghost"
                          className="text-sm text-muted-foreground flex flex-row items-center gap-2"
                          type="submit"
                        >
                          {fetcher.state === "submitting" ? (
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
                            Are you absolutely sure to delete this comment?
                          </DialogTitle>
                          <DialogDescription>
                            This action cannot be undone. This will permanently
                            delete your comment.
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
                        placeholder={`Reply as ${username}`}
                        onChange={(e) => setNewReplyMessage(e.target.value)}
                      />
                      <input type="hidden" name="intent" value="new-reply" />
                      <input type="hidden" name="commentId" value={item.id} />
                    </div>
                    <Button variant="ghost" className="mt-4" type="submit">
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
                    <div className="flex flex-col gap-2 mt-2" key={item.id}>
                      <div className="flex flex-row gap-4">
                        <div className="flex flex-row gap-2">
                          <CornerDownRight
                            size={15}
                            className="text-muted-foreground mt-1"
                          />
                          <Avatar className="h-[30px] w-[30px]">
                            <AvatarImage src={item.user.image as string} />
                            <AvatarFallback>
                              {fallbackInitials(item.user.name)}
                            </AvatarFallback>
                          </Avatar>
                        </div>
                        <div className="w-full">
                          <div className="flex flex-row gap-2 items-center">
                            <div className="text-sm">
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
                                  replyCommentId === item.id ? null : item.id,
                                )
                              }
                            >
                              <Reply size={15} />
                              Reply
                            </Button>
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
                                  value={replyMessage}
                                  placeholder={`Reply as ${username}`}
                                  onChange={(e) =>
                                    setReplyMessage(e.target.value)
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
                                {fetcher.state === "submitting" ? (
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
            action={`/dashboard/user/management/profile/${activityLog?.id}`}
          >
            <div className="w-full">
              <Label className="mb-2">Add comment</Label>
              <Textarea
                id="comment"
                name="comment"
                value={commentMessage}
                onChange={(e) => setCommentMessage(e.target.value)}
                placeholder={`Comment as ${username}`}
                className="w-full"
              />
              <input type="hidden" name="intent" value="comment" />
              <input type="hidden" name="activityId" value={activityLog?.id} />
            </div>
            <Button variant="ghost" className="mt-4" type="submit">
              {fetcher.state === "submitting" ? (
                <Loader2 className="animate-spin" />
              ) : (
                <Send />
              )}
            </Button>
          </fetcher.Form>
        </SheetFooter>
      </div>
    </SheetContainer>
  );
};

const NotificationContent = () => {
  const navigate = useNavigate();
  const {
    notifications,
    clearNotifications,
    removeNotification,
    markAllAsRead,
    markAsRead,
  } = useNotificationStore();
  const unreadNotifications = notifications.filter(
    (item) => item.status === "unread",
  ).length;

  const handleClearAll = async () => {
    const userId = notifications[0].userId;
    const response = await rpc.notifications[":id"]["clear-all"].$delete({
      param: {
        id: userId,
      },
    });
    const data = await response.json();
    if (data.success) {
      clearNotifications();
    }
  };

  const handleClearSingle = async (id: string) => {
    const response = await rpc.notifications[":id"].clear.$delete({
      param: {
        id: id,
      },
    });
    const data = await response.json();
    if (data.success) {
      removeNotification(id);
    }
  };

  const handleMarkAllAsRead = async () => {
    const userId = notifications[0].userId;
    const response = await rpc.notifications[":id"]["mark-all-as-read"].$patch({
      param: {
        id: userId,
      },
    });
    const data = await response.json();
    if (data.success) {
      markAllAsRead();
    }
  };

  const handleReadNotifications = async (
    notificationId: string,
    activityId: string,
  ) => {
    const response = await rpc.notifications[":id"]["mark-as-read"].$patch({
      param: {
        id: notificationId,
      },
    });
    const data = await response.json();
    if (data.success) {
      markAsRead(notificationId);
      navigate(`/dashboard/user/activity-logs?activity=${activityId}`);
    }
  };

  return (
    <SheetContainer>
      <SheetHeader>
        <SheetTitle>Notifications</SheetTitle>
        <div className="flex flex-row items-center justify-between">
          <SheetDescription>
            {notifications.length > 0
              ? `You have ${unreadNotifications} unread message${unreadNotifications !== 1 ? "s" : ""}`
              : "You have no notifications"}
          </SheetDescription>
          {notifications.length > 0 && (
            <p className="text-sm cursor-pointer" onClick={handleClearAll}>
              Clear notifications
            </p>
          )}
        </div>
      </SheetHeader>
      <div className="mx-4 mt-[-1rem] flex flex-col gap-2 overflow-y-auto">
        {notifications.map((item) => (
          <div className="flex flex-col gap-2" key={item.id}>
            <div
              className="relative border-input border-[1px] rounded-md p-4 cursor-pointer"
              onClick={() =>
                handleReadNotifications(item.id, item.activityId as string)
              }
            >
              <p
                className="absolute text-sm text-muted-foreground right-4 top-2 z-50"
                onClick={(e) => {
                  e.stopPropagation();
                  handleClearSingle(item.id);
                }}
              >
                Clear
              </p>
              <div className="flex flex-row gap-4">
                <span className="w-[10px] h-[10px] bg-blue-500 rounded-[50%] block"></span>
                <div>
                  <div className="flex flex-row items-center gap-2">
                    <h1 className="truncate max-w-sm">{item.message}</h1>
                    <Badge className="capitalize">{item.status}</Badge>
                  </div>
                  <div className="flex flex-row items-center justify-between">
                    <p className="text-sm text-muted-foreground">
                      {formatRelativeTime(item.createdAt)}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      {notifications.length > 0 && (
        <SheetFooter>
          <Button
            className="h-12 p-4"
            variant="outline"
            onClick={handleMarkAllAsRead}
            disabled={unreadNotifications === 0}
          >
            <Check className="mt-[0.1rem]" />
            Mark as all read
          </Button>
        </SheetFooter>
      )}
    </SheetContainer>
  );
};

export {
  ReviewUserAccessRequestContent,
  ReviewActivityLogContent,
  TestReviewActivityLogContent,
  NotificationContent,
  SheetContainer,
};
