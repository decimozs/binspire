import { SortingButton } from "@/features/data-table/components/sorting-button";
import { formatCamelCase } from "@binspire/shared";
import type { ColumnDef } from "@tanstack/react-table";
import { ArrowDownAZ, ArrowUpAZ, ArrowUpDown } from "lucide-react";
import { type History } from "@binspire/query";

export const historyColumns: ColumnDef<History>[] = [
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
];
