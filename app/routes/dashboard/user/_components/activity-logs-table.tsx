import { Sheet, SheetTrigger } from "@/components/ui/sheet";
import {
  DynamicActionBadge,
  DynamicStatusBadge,
} from "@/components/shared/dynamic-badge";
import DynamicTableHeaderRow from "@/components/shared/dynamic-table-header-row";
import { TableContainer } from "@/components/shared/table-container";
import { Button } from "@/components/ui/button";
import {
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { fromTitle, tableRowColumns } from "@/lib/constants";
import type { Status, Title, User, UserActivities } from "@/lib/types";
import { formatDate } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { Ellipsis } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useFetcher } from "react-router";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import {
  ActionDescriptionHoverCard,
  UserHoverCard,
} from "@/components/shared/hover";
import { DeleteUserActivityContent } from "@/components/shared/dialog-content";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { ReviewActivityLogContent } from "@/components/shared/sheet-content";
import { useQueryState } from "nuqs";

export default function ActivityLogsTable({
  activities,
  username,
}: {
  activities?: UserActivities;
  username: string;
}) {
  const { data } = useQuery({
    queryKey: ["users-activities"],
    queryFn: () => activities,
  });
  const { activityLogsTable } = tableRowColumns;
  const [deleteDialog, setDeleteDialog] = useState(false);
  const [replyCommentId, setReplyCommentId] = useState<string | null>(null);
  const [replyMessage, setReplyMessage] = useState("");
  const [newReplyMessage, setNewReplyMessage] = useState("");
  const [commentMessage, setCommentMessage] = useState("");
  const [viewReplies, setViewReplies] = useState<string | null>(null);
  const [openSheetId, setOpenSheetId] = useQueryState("activity", {
    history: "replace",
  });

  const fetcher = useFetcher();

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
    <TableContainer
      data={data as UserActivities}
      defaultSortDirection="desc"
      sorter={(a, b) =>
        new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      }
      searchFilter={(data, query) => {
        const q = query.toLowerCase();
        return (
          data.title.toLowerCase().includes(q) ||
          data.action.toLowerCase().includes(q) ||
          data.description.toLowerCase().includes(q) ||
          data.user.name.toLowerCase().includes(q) ||
          data.user.role.toLowerCase().includes(q) ||
          data.status.toLowerCase().includes(q)
        );
      }}
      dateFilter={(user, from, to) => {
        const createdAt = new Date(user.createdAt);
        return (!from || createdAt >= from) && (!to || createdAt <= to);
      }}
    >
      {({ paginatedData }) => (
        <>
          <TableHeader>
            <DynamicTableHeaderRow columns={activityLogsTable} />
          </TableHeader>
          <TableBody>
            {paginatedData && paginatedData.length > 0 ? (
              paginatedData.map((item) => {
                const isSheetOpen = openSheetId === item.id;
                return (
                  <Sheet
                    key={item.id}
                    open={isSheetOpen}
                    onOpenChange={(open) =>
                      setOpenSheetId(open ? item.id : null)
                    }
                  >
                    <TableRow>
                      <TableCell>{fromTitle[item.title as Title]}</TableCell>
                      <TableCell>
                        <SheetTrigger asChild>
                          <ActionDescriptionHoverCard
                            data={item}
                            onReviewClick={() => setOpenSheetId(item.id)}
                          />
                        </SheetTrigger>
                      </TableCell>
                      <TableCell>
                        <DynamicStatusBadge status={item.status as Status} />
                      </TableCell>
                      <TableCell>
                        <UserHoverCard data={item.user as User} />
                      </TableCell>
                      <TableCell>{formatDate(item.createdAt)}</TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost">
                              <Ellipsis />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent className="mr-8 mt-[-0.7rem]">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <div className="flex flex-col items-start">
                              <SheetTrigger asChild>
                                <Button
                                  variant="ghost"
                                  className="p-2 text-sm w-fit font-normal"
                                >
                                  Review
                                </Button>
                              </SheetTrigger>
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
                                <DeleteUserActivityContent
                                  activityId={item.id}
                                  name={item.user.name}
                                  role={item.user.role}
                                  action={item.action}
                                  title={item.title}
                                  description={item.description}
                                  fetcher={fetcher}
                                />
                              </Dialog>
                            </div>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                    <ReviewActivityLogContent
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
                  </Sheet>
                );
              })
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-6">
                  No activities found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </>
      )}
    </TableContainer>
  );
}
