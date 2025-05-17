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
import type { Role, User } from "@/lib/types";
import { Ellipsis } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { Link, useFetcher, useNavigate, useNavigation } from "react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { formatDate } from "@/lib/utils";
import { DynamicRoleBadge } from "@/components/shared/dynamic-badge";
import { TableContainer } from "@/components/shared/table-container";
import { DeleteUserContent } from "@/components/shared/dialog-content";
import { UserHoverCard } from "@/components/shared/hover";

export default function UsersTable({ data }: { data: User[] }) {
  const fetcher = useFetcher();
  const [deleteDialog, setDeleteDialog] = useState(false);
  const navigate = useNavigate();
  const { userManagementTable } = tableRowColumns;

  useEffect(() => {
    if (fetcher.data?.success) {
      toast.success("User Deleted", {
        action: {
          label: "Review",
          onClick: () =>
            navigate(
              `/dashboard/user/activity-logs?activity=${fetcher.data.activityId}`,
            ),
        },
      });
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
                  <UserHoverCard data={item} />
                </TableCell>
                <TableCell>{item.email}</TableCell>
                <TableCell>
                  <DynamicRoleBadge role={item.role as Role} />
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
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem>
                        <Link
                          to={`/dashboard/user/management/profile/${item.id}`}
                          prefetch="intent"
                        >
                          View
                        </Link>
                      </DropdownMenuItem>
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
                        <DeleteUserContent data={item} fetcher={fetcher} />
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
