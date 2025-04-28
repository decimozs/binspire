import { Sheet, SheetTrigger } from "@/components/ui/sheet";
import {
  DynamicActionBadge,
  DynamicActionStatusBadge,
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
import { tableRowColumns } from "@/lib/constants";
import type { User, UserActivities } from "@/lib/types";
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
import { UserHoverCard } from "@/components/shared/hover";
import { DeleteUserActivityContent } from "@/components/shared/dialog-content";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import {
  ReviewActivityLogContent,
  ReviewUserActivityContent,
} from "@/components/shared/sheet-content";

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
      sorter={(a, b) => a.title.localeCompare(b.title)}
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
              paginatedData.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>{item.title}</TableCell>
                  <TableCell>
                    <span className="flex flex-row items-center gap-2">
                      <DynamicActionBadge action={item.action} />
                      {item.description}
                    </span>
                  </TableCell>
                  <TableCell>
                    <DynamicActionStatusBadge status={item.status} />
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
                          <Sheet>
                            <SheetTrigger asChild>
                              <Button
                                variant="ghost"
                                className="p-2 text-sm w-fit font-normal"
                              >
                                Review
                              </Button>
                            </SheetTrigger>
                            <ReviewActivityLogContent
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
              ))
            ) : (
              <TableRow>
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-6 ">
                    No activities found
                  </TableCell>
                </TableRow>
              </TableRow>
            )}
          </TableBody>
        </>
      )}
    </TableContainer>
  );
}
