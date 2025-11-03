import type { ColumnDef } from "@tanstack/react-table";
import { SortingButton } from "@/features/data-table/components/sorting-button";
import {
  ArrowDown10,
  ArrowDownAZ,
  ArrowUp01,
  ArrowUpAZ,
  ArrowUpDown,
} from "lucide-react";
import { TrashbinStatus } from "./trashbin-details";
import type { TrashbinCollections } from "@binspire/query";
import { UserColumn } from "@binspire/ui/badges";

export const trashbinCollectionColumns: ColumnDef<TrashbinCollections>[] = [
  {
    accessorFn: (row) => row.trashbinId,
    id: "trashbinId",
  },
  {
    accessorFn: (row) => row.trashbin.name,
    id: "trashbinName",
    header: ({ column }) => (
      <SortingButton
        label="Trashbin"
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
    cell: ({ getValue }) => <p>{getValue<string>()}</p>,
  },
  {
    accessorKey: "wasteLevel",
    sortingFn: "basic",
    header: ({ column }) => (
      <SortingButton
        label="Waste Level"
        column={column}
        icons={{
          asc: <ArrowUp01 className="h-4 w-4" />,
          desc: <ArrowDown10 className="h-4 w-4" />,
          default: <ArrowUpDown className="h-4 w-4" />,
        }}
        menuLabels={{
          asc: "ASC",
          desc: "DESC",
        }}
      />
    ),
    cell: ({ row }) => (
      <TrashbinStatus
        label="Waste Level"
        value={row.getValue("wasteLevel")}
        unit="%"
        type="waste-level"
        enabledColumn={true}
      />
    ),
  },
  {
    accessorKey: "weightLevel",
    accessorFn: (row) => Number(row.weightLevel),
    header: ({ column }) => (
      <SortingButton
        label="Weight Level"
        column={column}
        icons={{
          asc: <ArrowUp01 className="h-4 w-4" />,
          desc: <ArrowDown10 className="h-4 w-4" />,
          default: <ArrowUpDown className="h-4 w-4" />,
        }}
        menuLabels={{
          asc: "ASC",
          desc: "DESC",
        }}
      />
    ),
    cell: ({ row }) => (
      <TrashbinStatus
        label="Weight Level"
        value={row.getValue("weightLevel")}
        unit="kg"
        type="weight-level"
        enabledColumn={true}
      />
    ),
    sortingFn: (rowA, rowB, columnId) => {
      const a = rowA.getValue<number>(columnId);
      const b = rowB.getValue<number>(columnId);
      return a - b;
    },
  },
  {
    accessorKey: "batteryLevel",
    sortingFn: "basic",
    header: ({ column }) => (
      <SortingButton
        label="Battery Level"
        column={column}
        icons={{
          asc: <ArrowUp01 className="h-4 w-4" />,
          desc: <ArrowDown10 className="h-4 w-4" />,
          default: <ArrowUpDown className="h-4 w-4" />,
        }}
        menuLabels={{
          asc: "ASC",
          desc: "DESC",
        }}
      />
    ),
    cell: ({ row }) => (
      <TrashbinStatus
        label="Battery Level"
        value={row.getValue("batteryLevel")}
        unit="%"
        type="battery-level"
        enabledColumn={true}
      />
    ),
  },
  {
    id: "user",
    accessorFn: (row) => row.collector.name,
    header: ({ column }) => (
      <SortingButton
        label="Collected by"
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
        name={row.original.collector.name}
        imageUrl={row.original.collector.image!}
      />
    ),
  },
];
