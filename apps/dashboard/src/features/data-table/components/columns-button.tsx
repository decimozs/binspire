import { formatCamelCase } from "@binspire/shared";
import { Button } from "@binspire/ui/components/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@binspire/ui/components/dropdown-menu";
import type { Table } from "@tanstack/react-table";
import { Check, Columns2 } from "lucide-react";

interface ColumnsButtonProps<T> {
  table: Table<T>;
}

export default function ColumnsButton<T>({ table }: ColumnsButtonProps<T>) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm">
          <Columns2 />
          Columns
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="center">
        {table.getAllColumns().map((column) => {
          if (column.id === "select" || column.id === "actions") return null;

          return (
            <DropdownMenuItem
              key={column.id}
              className="grid grid-cols-2 capitalize"
              onClick={() => column.toggleVisibility()}
            >
              <p>
                {typeof column.columnDef.header === "string"
                  ? column.columnDef.header
                  : column.id === "updatedAt"
                    ? "Last Updated"
                    : formatCamelCase(column.id)}
              </p>
              <p className="ml-auto">
                {column.getIsVisible() && <Check className="w-4 h-4" />}
              </p>
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
