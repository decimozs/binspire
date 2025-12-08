import type { UserRequest } from "@binspire/query";
import { formatLabel } from "@binspire/shared";
import { RequestAccessStatusBadge, UserColumn } from "@binspire/ui/badges";
import type { ColumnDef } from "@tanstack/react-table";
import { ArrowDownAZ, ArrowUpAZ, ArrowUpDown } from "lucide-react";
import { SortingButton } from "@/features/data-table/components/sorting-button";

export const userRequestColumns: ColumnDef<UserRequest>[] = [
  {
    id: "title",
    accessorKey: "title",
    header: "Title",
    cell: ({ row }) => (
      <p className="truncate max-w-[300px]">{row.getValue("title")}</p>
    ),
  },
  {
    id: "type",
    accessorKey: "type",
    header: () => <p>Type</p>,
    cell: ({ row }) => (
      <p className="text-xs px-3 py-1 rounded-md w-fit border-[1px] border-muted">
        {formatLabel(row.original.type)}
      </p>
    ),
    filterFn: "arrIncludesSome",
  },
  {
    id: "status",
    accessorKey: "status",
    header: () => <p>Status</p>,
    cell: ({ row }) => (
      <RequestAccessStatusBadge status={row.getValue("status")} />
    ),
    filterFn: "arrIncludesSome",
  },
  {
    id: "user",
    accessorFn: (row) => row.user?.name || "",
    header: ({ column }) => (
      <SortingButton
        label="Requested by"
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
