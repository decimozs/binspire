import type { Title, User, ActivityLogs } from "@/lib/types";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Calendar,
  Ellipsis,
  KeyRound,
  Mail,
  Pencil,
  UsersRound,
} from "lucide-react";
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
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { Link, useFetcher } from "react-router";
import { useEffect, useState } from "react";
import { fromTitle } from "@/lib/constants";
import { DeleteUserActivity } from "@/components/shared/dialog-content";
import { useDashboardLayoutLoader } from "../../layout";
import { UpdateUser } from "@/components/action/users";

export default function UserInfo({
  isCurrentUser,
  data,
  user,
}: {
  isCurrentUser: boolean;
  data: ActivityLogs;
  user: User;
}) {
  const fetcher = useFetcher();
  const loaderData = useDashboardLayoutLoader();
  const [deleteDialog, setDeleteDialog] = useState(false);
  const [replyCommentId, setReplyCommentId] = useState<string | null>(null);
  const [replyMessage, setReplyMessage] = useState("");
  const [newReplyMessage, setNewReplyMessage] = useState("");
  const [commentMessage, setCommentMessage] = useState("");
  const [viewReplies, setViewReplies] = useState<string | null>(null);
  const [searchActivity, setSearchActivity] = useQueryState("search");
  const [, setReviewActivityLog] = useQueryState("activity", {
    history: "replace",
  });
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

  const filteredData = data.filter((item) => {
    const query = (searchActivity || "").toLowerCase();
    return (
      item.title?.toLowerCase().includes(query) ||
      item.action?.toLowerCase().includes(query) ||
      item.description?.toLowerCase().includes(query) ||
      item.status?.toLowerCase().includes(query)
    );
  });

  const { paginatedData, safePage, totalPages, totalItems } = usePagination(
    filteredData,
    pageNumber,
    pageSize,
  );

  return (
    <div className="grid grid-cols-[1fr_2fr] gap-12">
      <div>
        <div className="w-full">
          <div className="bg-muted-foreground w-full h-[150px] rounded-md"></div>
          <div className="relative">
            <Avatar className="ml-5 h-[120px] w-[120px] absolute top-[-4rem]">
              <AvatarImage src={user.image as string} alt="@shadcn" />
              <AvatarFallback>
                {fallbackInitials(user.name as string)}
              </AvatarFallback>
            </Avatar>
          </div>
        </div>
        <div className="w-full mt-18 flex flex-col gap-3">
          <div className="flex flex-row items-center justify-between gap-4">
            <div className="flex flex-row items-center gap-4">
              <p className="text-2xl">{user.name}</p>
              <DynamicActiveBadge isOnline={user.isOnline as boolean} />
            </div>
            {isCurrentUser && <UpdateUser user={user} />}
          </div>
          <div className="flex flex-col gap-1">
            <p className="text-sm flex flex-row gap-2 items-center text-muted-foreground">
              <Mail size={15} className="mt-[0.1rem]" />
              {user.email}
            </p>
            <p className="text-sm flex flex-row gap-2 items-center text-muted-foreground capitalize">
              <UsersRound size={15} className="mt-[0.1rem]" />
              {user.role}
            </p>
            <p className="text-sm flex flex-row gap-2 items-center text-muted-foreground">
              <KeyRound size={15} className="mt-[0.1rem]" />
              {formatPermission(user.permission as string)}
            </p>
            <p className="text-sm flex flex-row gap-2 items-center text-muted-foreground">
              <Calendar size={15} className="mt-[0.1rem]" />
              Joined on {formatDate(user.createdAt as Date)}
            </p>
          </div>
        </div>
      </div>
      <div>
        <div className="flex flex-col gap-2">
          <p className="text-xl">User Activity</p>
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
            <div className="flex flex-col">
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
          <div className="flex flex-col gap-2 flex-1 overflow-y-auto h-[90vh]">
            {paginatedData.map((item) => (
              <div
                className="p-4 border-input border-[1px] rounded-md flex flex-row items-center justify-between"
                key={item.id}
              >
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
                  <DropdownMenuContent className="mr-[3rem] mt-[-1rem]">
                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <div className="flex flex-col items-start">
                      <DropdownMenuItem>
                        <Link
                          to={`/dashboard/user/activity-logs?activity=${item.id}`}
                        >
                          Review
                        </Link>
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
