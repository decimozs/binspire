import { SortingButton } from "@/features/data-table/components/sorting-button";
import type { UserInvitation } from "@binspire/query";
import { InvitationStatusBadge, UserColumn } from "@binspire/ui/badges";
import type { ColumnDef } from "@tanstack/react-table";
import { ArrowDownAZ, ArrowUpAZ, ArrowUpDown } from "lucide-react";

export const userInvitationColumns: ColumnDef<UserInvitation>[] = [
  {
    id: "email",
    accessorKey: "email",
    header: "Email",
  },
  {
    id: "status",
    accessorKey: "status",
    header: () => <p>Status</p>,
    cell: ({ row }) => (
      <InvitationStatusBadge status={row.getValue("status")} />
    ),
    filterFn: "arrIncludesSome",
  },
  {
    id: "user",
    accessorFn: (row) => row.user.name,
    header: ({ column }) => (
      <SortingButton
        label="Invited by"
        column={column}
        icons={{
          asc: <ArrowUpAZ className="h-4 w-4" />,
          desc: <ArrowDownAZ className="h-4 w-4" />,
          default: <ArrowUpDown className="h-4 w-4" />,
        }}
        menuLabels={{
          asc: "A → Z",
          desc: "Z → A",
        }}
      />
    ),
    cell: ({ row }) => (
      <UserColumn
        name={row.original.user.name}
        imageUrl={row.original.user.image!}
      />
    ),
  },
];
