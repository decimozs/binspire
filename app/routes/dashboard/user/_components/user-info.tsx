import type { Title, User, UserActivities } from "@/lib/types";
import { useQuery } from "@tanstack/react-query";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Sheet, SheetTrigger } from "@/components/ui/sheet";
import { Calendar, Ellipsis, KeyRound, Mail, UsersRound } from "lucide-react";
import { fallbackInitials, formatDate, formatPermission } from "@/lib/utils";
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
import { ReviewUserActivityContent } from "@/components/shared/sheet-content";
import { fromTitle } from "@/lib/constants";
import { DeleteUserActivity } from "@/components/shared/dialog-content";

export default function UserInfo({
  user,
  activity,
  username,
}: {
  user?: User;
  activity?: UserActivities;
  username?: string;
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
      data.title?.toLowerCase().includes(query) ||
      data.action?.toLowerCase().includes(query) ||
      data.description?.toLowerCase().includes(query) ||
      data.status?.toLowerCase().includes(query)
    );
  });

  const { paginatedData, safePage, totalPages, totalItems } = usePagination(
    filteredData as UserActivities,
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
            <>
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
              <div className="flexb border-input border-dashed border-[1px] p-4 rounded-md justify-center items-center">
                <p className="text-sm text-muted-foreground text-center">
                  This user does not have any activity right now.
                </p>
              </div>
            </>
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
                    <Badge className="capitalize mr-2 mb-2">
                      {item.action}
                    </Badge>
                    <Badge className="capitalize mb-2">{item.status}</Badge>
                    <p> {fromTitle[item.title as Title]}</p>
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
                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <div className="flex flex-col items-start">
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
                          <ReviewUserActivityContent
                            data={item}
                            fetcher={fetcher}
                            username={username as string}
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
                        </Sheet>
                      </DropdownMenuItem>
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
                          <DeleteUserActivity
                            activityId={item.id}
                            fetcher={fetcher}
                          />
                        </Dialog>
                      </DropdownMenuItem>
                    </div>
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
