import type { DateRange } from "@binspire/ui/components/calendar";
import { Checkbox } from "@binspire/ui/components/checkbox";
import type { ColumnDef } from "@tanstack/react-table";
import { format, formatDistanceToNow } from "date-fns";
import { ArrowDown, ArrowUp, ArrowUpDown } from "lucide-react";
import type { ReactNode } from "react";
import { SortingButton } from "../components/sorting-button";

export function createdAtColumn<T>(columnName?: string): ColumnDef<T> {
  return {
    id: "createdAt",
    accessorKey: "createdAt",
    header: ({ column }) => (
      <div>
        <SortingButton
          label={columnName ?? "Created At"}
          column={column}
          icons={{
            asc: <ArrowUp className="h-4 w-4" />,
            desc: <ArrowDown className="h-4 w-4" />,
            default: <ArrowUpDown className="h-4 w-4" />,
          }}
          menuLabels={{
            asc: "ASC",
            desc: "DESC",
          }}
        />
      </div>
    ),
    cell: ({ row }) => {
      const raw = row.getValue("createdAt") as string | Date | null | undefined;
      if (!raw) return null;

      const date = raw instanceof Date ? raw : new Date(raw);

      return (
        <div className="capitalizei text-sm">
          <p>{format(date, "eee, MMM d, yyyy")}</p>
          <p className="text-muted-foreground">{format(date, "h:mm a")}</p>
        </div>
      );
    },
    sortingFn: (rowA, rowB, columnId) => {
      const a = new Date(rowA.getValue(columnId)).getTime();
      const b = new Date(rowB.getValue(columnId)).getTime();
      return a - b;
    },
    filterFn: (row, columnId, filterValue: DateRange | undefined) => {
      if (!filterValue?.from || !filterValue?.to) return true;

      const date = new Date(row.getValue(columnId));
      const from = new Date(filterValue.from);
      const to = new Date(filterValue.to);

      return date >= from && date <= to;
    },
  };
}

export function updatedAtColumn<T>(columnName?: string): ColumnDef<T> {
  return {
    id: "updatedAt",
    accessorKey: "updatedAt",
    header: ({ column }) => (
      <SortingButton
        label={columnName ?? "Last Updated"}
        column={column}
        icons={{
          asc: <ArrowUp className="h-4 w-4" />,
          desc: <ArrowDown className="h-4 w-4" />,
          default: <ArrowUpDown className="h-4 w-4" />,
        }}
        menuLabels={{
          asc: "ASC",
          desc: "DESC",
        }}
      />
    ),
    cell: ({ row }) => {
      const value = row.getValue("updatedAt");
      if (!value) return "—";

      return (
        <div>
          <p className="text-muted-foreground">
            {formatDistanceToNow(new Date(value as string), {
              addSuffix: true,
            })}
          </p>
        </div>
      );
    },
  };
}

export function selectColumn<T>(): ColumnDef<T> {
  return {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={table.getIsAllPageRowsSelected()}
        onCheckedChange={(value) => {
          if (value) {
            table.toggleAllPageRowsSelected(true);
          } else {
            table.resetRowSelection();
          }
        }}
        aria-label="Select all"
        className="ml-4"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
        className="ml-4"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  };
}

export function actionsColumn<T>(render?: (row: T) => ReactNode): ColumnDef<T> {
  return {
    id: "actions",
    cell: ({ row }) => render?.(row.original),
    meta: {
      className: "flex justify-end",
    },
    enableSorting: false,
    enableHiding: false,
  };
}
