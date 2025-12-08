import type { Audit } from "@binspire/query";
import { formatCamelCase } from "@binspire/shared";
import { AuditActionBadge, UserColumn } from "@binspire/ui/badges";
import type { ColumnDef } from "@tanstack/react-table";
import { ArrowDownAZ, ArrowUpAZ, ArrowUpDown } from "lucide-react";
import { SortingButton } from "@/features/data-table/components/sorting-button";

export const auditColumns: ColumnDef<Audit>[] = [
  {
    id: "title",
    accessorKey: "title",
    header: ({ column }) => (
      <SortingButton
        label="Title"
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
      <p className="truncate max-w-[300px]">{row.getValue("title")}</p>
    ),
  },
  {
    id: "entity",
    accessorKey: "entity",
    header: () => <p>Entity</p>,
    cell: ({ row }) => (
      <p className="text-xs px-3 py-1 rounded-md w-fit border-[1px] border-muted">
        {formatCamelCase(row.getValue("entity"))}
      </p>
    ),
    filterFn: "arrIncludesSome",
  },
  {
    id: "action",
    accessorKey: "action",
    header: () => <p>Action</p>,
    cell: ({ row }) => <AuditActionBadge action={row.getValue("action")} />,
    filterFn: "arrIncludesSome",
  },
  {
    id: "user",
    accessorFn: (row) => row.user.name,
    header: ({ column }) => (
      <SortingButton
        label="Committed by"
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
