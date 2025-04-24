import DynamicTableHeaderRow from "@/components/shared/dynamic-table-header-row";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { tableRowColumns } from "@/lib/constants";
import type { User } from "@/lib/types";
import { useQuery } from "@tanstack/react-query";
import { Ellipsis } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Link, useFetcher } from "react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { formatDate } from "@/lib/utils";
import {
  DynamicActiveBadge,
  DynamicRoleBadge,
} from "@/components/shared/dynamic-badge";
import { TableContainer } from "@/components/shared/table-container";

export default function UsersTable({ users }: { users?: User[] }) {
  const { data } = useQuery({
    queryKey: ["users"],
    queryFn: () => users,
  });

  const fetcher = useFetcher();
  const [deleteDialog, setDeleteDialog] = useState(false);
  const { userManagementTable } = tableRowColumns;

  useEffect(() => {
    if (fetcher.data?.success) {
      toast.success("Request Deleted");
      setDeleteDialog(false);
    }
  }, [fetcher.data]);

  return (
    <TableContainer
      data={data || []}
      sorter={(a, b) => a.name.localeCompare(b.name)}
      defaultSortDirection="asc"
      searchFilter={(user, query) => {
        const q = query.toLowerCase();
        return (
          user.name.toLowerCase().includes(q) ||
          user.email.toLowerCase().includes(q) ||
          user.role.toLowerCase().includes(q) ||
          user.permission.toLowerCase().includes(q) ||
          (user.isOnline ? "online" : "offline").includes(q)
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
            <DynamicTableHeaderRow columns={userManagementTable} />
          </TableHeader>
          <TableBody>
            {paginatedData?.map((item) => (
              <TableRow key={item.id} className="h-[50px]">
                <TableCell>
                  <span className="flex flex-row gap-2 items-center">
                    {item.name}
                    <DynamicActiveBadge isOnline={item.isOnline} />
                  </span>
                </TableCell>
                <TableCell>{item.email}</TableCell>
                <TableCell>
                  <DynamicRoleBadge role={item.role} />
                </TableCell>
                <TableCell className="capitalize">
                  {formatDate(item.createdAt)}
                </TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost">
                        <Ellipsis />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="mr-8 mt-[-0.7rem]">
                      <DropdownMenuItem>
                        <Link
                          to={`/dashboard/user/management/profile/${item.id}`}
                          prefetch="intent"
                        >
                          View
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
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
                            <DialogTitle>Delete user?</DialogTitle>
                            <DialogDescription>
                              This action cannot be undone. This will
                              permanently delete the user account.
                            </DialogDescription>
                          </DialogHeader>
                          <DialogFooter>
                            <fetcher.Form
                              method="POST"
                              action="/dashboard/user/management"
                            >
                              <input
                                type="hidden"
                                name="userId"
                                value={item.id}
                              />
                              <Button
                                type="submit"
                                disabled={fetcher.state === "submitting"}
                              >
                                {fetcher.state === "submitting"
                                  ? "Deleting..."
                                  : "Confirm"}
                              </Button>
                            </fetcher.Form>
                            <DialogClose asChild>
                              <Button variant="outline">Cancel</Button>
                            </DialogClose>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </>
      )}
    </TableContainer>
  );
}
