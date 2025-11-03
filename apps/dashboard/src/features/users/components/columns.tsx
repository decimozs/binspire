import { authClient } from "@/lib/auth-client";
import type { User } from "@binspire/query";
import type { UserRole } from "@binspire/shared";
import { UserRoleBadge } from "@binspire/ui/badges";
import type { ColumnDef } from "@tanstack/react-table";

export const userColumns: ColumnDef<User>[] = [
  {
    id: "name",
    accessorKey: "name",
    header: "Name",
    cell: ({ row }) => {
      const { data: currentUser } = authClient.useSession();
      const isCurrentUser = currentUser?.user.id === row.original.id;
      return (
        <div className="flex flex-row items-center gap-2">
          <p>{row.original.name}</p>
          {isCurrentUser && (
            <p className="text-xs px-3 py-1 rounded-md w-fit border-[1px] border-muted bg-primary text-secondary font-bold">
              Me
            </p>
          )}
        </div>
      );
    },
  },
  {
    id: "email",
    accessorKey: "email",
    header: "Email",
  },
  {
    id: "role",
    accessorFn: (row) => row.status.role,
    header: () => <p>Role</p>,
    cell: ({ getValue }) => (
      <UserRoleBadge role={getValue<string>() as UserRole} />
    ),
    filterFn: "arrIncludesSome",
  },
];
