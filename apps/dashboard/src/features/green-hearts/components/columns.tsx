import { SortingButton } from "@/features/data-table/components/sorting-button";
import type { UserGreenHeart } from "@binspire/query";
import { UserColumn } from "@binspire/ui/badges";
import type { ColumnDef } from "@tanstack/react-table";
import {
  ArrowDown10,
  ArrowDownAZ,
  ArrowUp01,
  ArrowUpAZ,
  ArrowUpDown,
} from "lucide-react";

export const greenHeartColumns: ColumnDef<UserGreenHeart>[] = [
  {
    id: "user",
    accessorFn: (row) => row.user.name,
    header: ({ column }) => (
      <SortingButton
        label="User"
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
  {
    id: "totalKg",
    accessorKey: "totalKg",
    header: ({ column }) => (
      <SortingButton
        label="Total KG"
        column={column}
        icons={{
          asc: <ArrowUp01 className="h-4 w-4" />,
          desc: <ArrowDown10 className="h-4 w-4" />,
          default: <ArrowUpDown className="h-4 w-4" />,
        }}
        menuLabels={{
          asc: "A → Z",
          desc: "Z → A",
        }}
      />
    ),
    cell: ({ row }) => (
      <p className="text-xs px-3 py-1 rounded-md w-fit border-[1px] border-muted">
        {row.getValue("totalKg")}
      </p>
    ),
  },
  {
    id: "points",
    accessorKey: "points",
    header: ({ column }) => (
      <SortingButton
        label="Points"
        column={column}
        icons={{
          asc: <ArrowUp01 className="h-4 w-4" />,
          desc: <ArrowDown10 className="h-4 w-4" />,
          default: <ArrowUpDown className="h-4 w-4" />,
        }}
        menuLabels={{
          asc: "A → Z",
          desc: "Z → A",
        }}
      />
    ),
    cell: ({ row }) => (
      <p className="text-xs px-3 py-1 rounded-md w-fit border-[1px] border-muted">
        + {row.getValue("points")}
      </p>
    ),
  },
  {
    id: "plastic",
    accessorKey: "plastic",
    header: ({ column }) => (
      <SortingButton
        label="Plastic"
        column={column}
        icons={{
          asc: <ArrowUp01 className="h-4 w-4" />,
          desc: <ArrowDown10 className="h-4 w-4" />,
          default: <ArrowUpDown className="h-4 w-4" />,
        }}
        menuLabels={{
          asc: "A → Z",
          desc: "Z → A",
        }}
      />
    ),
    cell: ({ row }) => (
      <p className="text-xs px-3 py-1 rounded-md w-fit border-[1px] border-muted">
        + {row.getValue("plastic")}
      </p>
    ),
  },
  {
    id: "paper",
    accessorKey: "paper",
    header: ({ column }) => (
      <SortingButton
        label="Paper"
        column={column}
        icons={{
          asc: <ArrowUp01 className="h-4 w-4" />,
          desc: <ArrowDown10 className="h-4 w-4" />,
          default: <ArrowUpDown className="h-4 w-4" />,
        }}
        menuLabels={{
          asc: "A → Z",
          desc: "Z → A",
        }}
      />
    ),
    cell: ({ row }) => (
      <p className="text-xs px-3 py-1 rounded-md w-fit border-[1px] border-muted">
        + {row.getValue("paper")}
      </p>
    ),
  },
  {
    id: "metal",
    accessorKey: "metal",
    header: ({ column }) => (
      <SortingButton
        label="Metal"
        column={column}
        icons={{
          asc: <ArrowUp01 className="h-4 w-4" />,
          desc: <ArrowDown10 className="h-4 w-4" />,
          default: <ArrowUpDown className="h-4 w-4" />,
        }}
        menuLabels={{
          asc: "A → Z",
          desc: "Z → A",
        }}
      />
    ),
    cell: ({ row }) => (
      <p className="text-xs px-3 py-1 rounded-md w-fit border-[1px] border-muted">
        + {row.getValue("metal")}
      </p>
    ),
  },
  {
    id: "glass",
    accessorKey: "glass",
    header: ({ column }) => (
      <SortingButton
        label="Glass"
        column={column}
        icons={{
          asc: <ArrowUp01 className="h-4 w-4" />,
          desc: <ArrowDown10 className="h-4 w-4" />,
          default: <ArrowUpDown className="h-4 w-4" />,
        }}
        menuLabels={{
          asc: "A → Z",
          desc: "Z → A",
        }}
      />
    ),
    cell: ({ row }) => (
      <p className="text-xs px-3 py-1 rounded-md w-fit border-[1px] border-muted">
        + {row.getValue("glass")}
      </p>
    ),
  },
];
