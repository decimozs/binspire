import type { ColumnDef } from "@tanstack/react-table";
import { SortingButton } from "@/features/data-table/components/sorting-button";
import { ArrowDownAZ, ArrowUpAZ, ArrowUpDown } from "lucide-react";
import type { Trashbin } from "@binspire/query";
import { TrashbinWasteTypeBadge } from "@binspire/ui/badges";
import { formatLabel } from "@binspire/shared";

export const trashbinColumns: ColumnDef<Trashbin>[] = [
  {
    accessorKey: "name",
    header: ({ column }) => (
      <SortingButton
        label="Name"
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
    accessorKey: "location",
    header: ({ column }) => (
      <SortingButton
        label="Location"
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
    accessorKey: "wasteType",
    header: "Waste Type",
    cell: ({ row }) => (
      <TrashbinWasteTypeBadge type={row.getValue("wasteType")} />
    ),
    filterFn: "arrIncludesSome",
  },
  {
    accessorKey: "department",
    header: "Department",
    cell: ({ row }) => (
      <p className="text-xs px-3 py-1 rounded-md w-fit border-[1px] border-muted">
        {formatLabel(row.original.department)}
      </p>
    ),
    filterFn: "arrIncludesSome",
  },
];
