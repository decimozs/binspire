import {
  DynamicPermissionBadge,
  DynamicRoleBadge,
} from "@/components/shared/dynamic-badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
import type { User } from "@/lib/types";
import { useQuery } from "@tanstack/react-query";
import { Ellipsis } from "lucide-react";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import {
  DeleteUserContent,
  UpdateUserPermissionContent,
} from "@/components/shared/dialog-content";
import { useFetcher } from "react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { UserHoverCard } from "@/components/shared/hover";

export default function RolesAndPermissionsTable({
  users,
}: {
  users?: User[];
}) {
  const { data } = useQuery({
    queryKey: ["users"],
    queryFn: () => users,
  });
  const { rolesAndPermissionsTable } = tableRowColumns;
  const [updatePermission, setUpdatePermission] = useState(false);
  const [deleteDialog, setDeleteDialog] = useState(false);
  const [selectedPermission, setSelectedPermission] = useState("viewer");
  const fetcher = useFetcher();

  useEffect(() => {
    if (
      fetcher.data?.success &&
      fetcher.data?.intent === "update-user-permission"
    ) {
      toast.success("User Permission Updated");
      setUpdatePermission(false);
    }

    if (fetcher.data?.success && fetcher.data?.intent === "delete") {
      toast.success("User Deleted");
      setDeleteDialog(false);
    }
  }, [fetcher.data]);

  return (
    <TableContainer
      data={data as User[]}
      sorter={(a, b) => a.name.localeCompare(b.name)}
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
            <DynamicTableHeaderRow columns={rolesAndPermissionsTable} />
          </TableHeader>
          <TableBody>
            {paginatedData && paginatedData.length > 0 ? (
              paginatedData.map((item) => (
                <TableRow key={item.id} className="h-[50px]">
                  <TableCell>
                    <UserHoverCard data={item} />
                  </TableCell>
                  <TableCell>{item.email}</TableCell>
                  <TableCell>
                    <DynamicRoleBadge role={item.role} />
                  </TableCell>
                  <TableCell>
                    <DynamicPermissionBadge permission={item.permission} />
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
                        <div className="flex flex-col items-start">
                          <Dialog
                            open={updatePermission}
                            onOpenChange={setUpdatePermission}
                          >
                            <DialogTrigger asChild>
                              <Button
                                variant="ghost"
                                className="p-2 text-sm w-fit font-normal"
                              >
                                Update
                              </Button>
                            </DialogTrigger>
                            <UpdateUserPermissionContent
                              data={item}
                              fetcher={fetcher}
                              updatedPermission={selectedPermission}
                              setUpdatedPermission={setSelectedPermission}
                            />
                          </Dialog>
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
                        </div>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-6 ">
                  No users found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </>
      )}
    </TableContainer>
  );
}
