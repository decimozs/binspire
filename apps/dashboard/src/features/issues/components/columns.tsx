import type { ColumnDef } from "@tanstack/react-table";
import { SortingButton } from "@/features/data-table/components/sorting-button";
import { ArrowDownAZ, ArrowUpAZ, ArrowUpDown } from "lucide-react";
import type { Issue } from "@binspire/query";
import { formatCamelCase } from "@binspire/shared";
import {
  IssuePriorityBadge,
  IssueStatusBadge,
  UserColumn,
} from "@binspire/ui/badges";

export const issueColumns: ColumnDef<Issue>[] = [
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
    id: "status",
    accessorKey: "status",
    header: () => <p>Status</p>,
    cell: ({ row }) => <IssueStatusBadge status={row.original.status} />,
    filterFn: "arrIncludesSome",
  },
  {
    id: "priority",
    accessorKey: "priority",
    header: () => <p>Priority</p>,
    cell: ({ row }) => <IssuePriorityBadge priority={row.original.priority} />,
    filterFn: "arrIncludesSome",
  },
  {
    id: "user",
    accessorFn: (row) => row.user.name,
    header: ({ column }) => (
      <SortingButton
        label="Issued by"
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
