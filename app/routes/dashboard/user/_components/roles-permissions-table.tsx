import {
  DynamicPermissionBadge,
  DynamicRoleBadge,
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
import type { User } from "@/lib/types";
import { useQuery } from "@tanstack/react-query";
import { Ellipsis } from "lucide-react";

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
                  <TableCell>{item.name}</TableCell>
                  <TableCell>{item.email}</TableCell>
                  <TableCell>
                    <DynamicRoleBadge role={item.role} />
                  </TableCell>
                  <TableCell>
                    <DynamicPermissionBadge permission={item.permission} />
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost">
                      <Ellipsis />
                    </Button>
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
